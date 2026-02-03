const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

class SFTPClient {
  constructor() {
    this.client = new Client();
    this.sftp = null;
    this.connected = false;
  }

  /**
   * Connect to SFTP server
   * @param {Object} config - Connection configuration
   * @param {string} config.host - Server hostname
   * @param {number} config.port - Server port (default: 22)
   * @param {string} config.username - Username
   * @param {string} config.password - Password (optional)
   * @param {string} config.privateKey - Path to private key (optional)
   */
  connect(config) {
    return new Promise((resolve, reject) => {
      const connectionConfig = {
        host: config.host,
        port: config.port || 22,
        username: config.username,
        readyTimeout: 30000, // 30 second timeout
        // debug: (info) => console.log('[SFTP Debug]', info)
      };

      // Add authentication method
      if (config.privateKey) {
        try {
          connectionConfig.privateKey = fs.readFileSync(config.privateKey);
        } catch (err) {
          return reject(new Error(`Failed to read private key: ${err.message}`));
        }
      } else if (config.password) {
        connectionConfig.password = config.password;
      } else {
        return reject(new Error('Either password or privateKey must be provided'));
      }

      let isResolved = false;

      this.client.on('ready', () => {
        if (isResolved) return;
        this.client.sftp((err, sftp) => {
          if (err) {
            isResolved = true;
            return reject(new Error(`SFTP initialization failed: ${err.message}`));
          }
          this.sftp = sftp;
          this.connected = true;
          isResolved = true;
          resolve();
        });
      });

      this.client.on('error', (err) => {
        if (isResolved) return;
        isResolved = true;
        reject(new Error(`Connection error: ${err.message}`));
      });

      this.client.on('timeout', () => {
        if (isResolved) return;
        isResolved = true;
        reject(new Error('Connection timeout - server did not respond'));
      });

      try {
        this.client.connect(connectionConfig);
      } catch (err) {
        if (isResolved) return;
        isResolved = true;
        reject(new Error(`Failed to initiate connection: ${err.message}`));
      }
    });
  }

  /**
   * Upload a file to the SFTP server
   * @param {string} localPath - Local file path
   * @param {string} remotePath - Remote destination path
   */
  upload(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      // Use fastPut instead of streaming for better compatibility
      this.sftp.fastPut(localPath, remotePath, {
        step: (total_transferred, chunk, total) => {
          const percent = Math.round((total_transferred / total) * 100);
          console.log(`[Upload Progress] ${percent}% (${total_transferred}/${total} bytes)`);
        }
      }, (err) => {
        if (err) {
          return reject(new Error(`Upload failed: ${err.message}`));
        }
        resolve();
      });
    });
  }

  /**
   * Disconnect from the SFTP server
   */
  disconnect() {
    if (this.connected) {
      this.client.end();
      this.connected = false;
    }
  }
}

module.exports = SFTPClient;
