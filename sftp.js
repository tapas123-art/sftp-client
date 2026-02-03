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
   * Download a file from the SFTP server
   * @param {string} remotePath - Remote file path
   * @param {string} localPath - Local destination path
   */
  download(remotePath, localPath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      // Use fastGet instead of streaming for better compatibility
      this.sftp.fastGet(remotePath, localPath, {
        step: (total_transferred, chunk, total) => {
          const percent = Math.round((total_transferred / total) * 100);
          console.log(`[Download Progress] ${percent}% (${total_transferred}/${total} bytes)`);
        }
      }, (err) => {
        if (err) {
          return reject(new Error(`Download failed: ${err.message}`));
        }
        resolve();
      });
    });
  }

  /**
   * List files in a remote directory
   * @param {string} remotePath - Remote directory path
   */
  list(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.readdir(remotePath, (err, list) => {
        if (err) {
          return reject(err);
        }
        resolve(list);
      });
    });
  }

  /**
   * Create a directory on the remote server
   * @param {string} remotePath - Remote directory path
   */
  mkdir(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.mkdir(remotePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Delete a file on the remote server
   * @param {string} remotePath - Remote file path
   */
  delete(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.unlink(remotePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Remove a directory on the remote server
   * @param {string} remotePath - Remote directory path
   */
  rmdir(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.rmdir(remotePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Rename a file or directory on the remote server
   * @param {string} oldPath - Current path
   * @param {string} newPath - New path
   */
  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.rename(oldPath, newPath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Get file stats
   * @param {string} remotePath - Remote file/directory path
   */
  stat(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        return reject(new Error('Not connected to SFTP server'));
      }

      this.sftp.stat(remotePath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        resolve(stats);
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
