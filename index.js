#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const SFTPClient = require('./sftp');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('sftp-client')
  .description('Cross-platform SFTP client using SSH2')
  .version('1.0.0');

// Upload command
program
  .command('upload')
  .description('Upload a file to the SFTP server')
  .requiredOption('-h, --host <host>', 'SFTP server hostname')
  .requiredOption('-u, --username <username>', 'Username')
  .option('-p, --port <port>', 'Port number', '22')
  .option('-w, --password <password>', 'Password')
  .option('-k, --key <keyPath>', 'Path to private key file')
  .requiredOption('-l, --local <localPath>', 'Local file path')
  .requiredOption('-r, --remote <remotePath>', 'Remote destination path')
  .action(async (options) => {
    const client = new SFTPClient();
    
    try {
      console.log(chalk.blue('Connecting to SFTP server...'));
      
      await client.connect({
        host: options.host,
        port: parseInt(options.port),
        username: options.username,
        password: options.password,
        privateKey: options.key
      });
      
      console.log(chalk.green('✓ Connected successfully'));
      console.log(chalk.blue(`Uploading ${options.local} to ${options.remote}...`));
      
      await client.upload(options.local, options.remote);
      
      console.log(chalk.green('✓ Upload completed successfully'));
      
      client.disconnect();
    } catch (err) {
      console.error(chalk.red('✗ Error:'), err.message);
      client.disconnect();
      process.exit(1);
    }
  });

// Download command
program
  .command('download')
  .description('Download a file from the SFTP server')
  .requiredOption('-h, --host <host>', 'SFTP server hostname')
  .requiredOption('-u, --username <username>', 'Username')
  .option('-p, --port <port>', 'Port number', '22')
  .option('-w, --password <password>', 'Password')
  .option('-k, --key <keyPath>', 'Path to private key file')
  .requiredOption('-r, --remote <remotePath>', 'Remote file path')
  .requiredOption('-l, --local <localPath>', 'Local destination path')
  .action(async (options) => {
    const client = new SFTPClient();
    
    try {
      console.log(chalk.blue('Connecting to SFTP server...'));
      
      await client.connect({
        host: options.host,
        port: parseInt(options.port),
        username: options.username,
        password: options.password,
        privateKey: options.key
      });
      
      console.log(chalk.green('✓ Connected successfully'));
      console.log(chalk.blue(`Downloading ${options.remote} to ${options.local}...`));
      
      await client.download(options.remote, options.local);
      
      console.log(chalk.green('✓ Download completed successfully'));
      
      client.disconnect();
    } catch (err) {
      console.error(chalk.red('✗ Error:'), err.message);
      client.disconnect();
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List files in a remote directory')
  .requiredOption('-h, --host <host>', 'SFTP server hostname')
  .requiredOption('-u, --username <username>', 'Username')
  .option('-p, --port <port>', 'Port number', '22')
  .option('-w, --password <password>', 'Password')
  .option('-k, --key <keyPath>', 'Path to private key file')
  .requiredOption('-r, --remote <remotePath>', 'Remote directory path')
  .action(async (options) => {
    const client = new SFTPClient();
    
    try {
      console.log(chalk.blue('Connecting to SFTP server...'));
      
      await client.connect({
        host: options.host,
        port: parseInt(options.port),
        username: options.username,
        password: options.password,
        privateKey: options.key
      });
      
      console.log(chalk.green('✓ Connected successfully'));
      console.log(chalk.blue(`Listing files in ${options.remote}...`));
      
      const files = await client.list(options.remote);
      
      console.log(chalk.white('\nFiles and directories:'));
      files.forEach(file => {
        const type = file.longname.startsWith('d') ? chalk.cyan('[DIR]') : chalk.yellow('[FILE]');
        const size = file.attrs.size.toString().padStart(10);
        console.log(`${type} ${file.filename.padEnd(30)} ${chalk.gray(size + ' bytes')}`);
      });
      
      client.disconnect();
    } catch (err) {
      console.error(chalk.red('✗ Error:'), err.message);
      client.disconnect();
      process.exit(1);
    }
  });

// Delete command
program
  .command('delete')
  .description('Delete a file on the remote server')
  .requiredOption('-h, --host <host>', 'SFTP server hostname')
  .requiredOption('-u, --username <username>', 'Username')
  .option('-p, --port <port>', 'Port number', '22')
  .option('-w, --password <password>', 'Password')
  .option('-k, --key <keyPath>', 'Path to private key file')
  .requiredOption('-r, --remote <remotePath>', 'Remote file path')
  .action(async (options) => {
    const client = new SFTPClient();
    
    try {
      console.log(chalk.blue('Connecting to SFTP server...'));
      
      await client.connect({
        host: options.host,
        port: parseInt(options.port),
        username: options.username,
        password: options.password,
        privateKey: options.key
      });
      
      console.log(chalk.green('✓ Connected successfully'));
      console.log(chalk.blue(`Deleting ${options.remote}...`));
      
      await client.delete(options.remote);
      
      console.log(chalk.green('✓ File deleted successfully'));
      
      client.disconnect();
    } catch (err) {
      console.error(chalk.red('✗ Error:'), err.message);
      client.disconnect();
      process.exit(1);
    }
  });

// Mkdir command
program
  .command('mkdir')
  .description('Create a directory on the remote server')
  .requiredOption('-h, --host <host>', 'SFTP server hostname')
  .requiredOption('-u, --username <username>', 'Username')
  .option('-p, --port <port>', 'Port number', '22')
  .option('-w, --password <password>', 'Password')
  .option('-k, --key <keyPath>', 'Path to private key file')
  .requiredOption('-r, --remote <remotePath>', 'Remote directory path')
  .action(async (options) => {
    const client = new SFTPClient();
    
    try {
      console.log(chalk.blue('Connecting to SFTP server...'));
      
      await client.connect({
        host: options.host,
        port: parseInt(options.port),
        username: options.username,
        password: options.password,
        privateKey: options.key
      });
      
      console.log(chalk.green('✓ Connected successfully'));
      console.log(chalk.blue(`Creating directory ${options.remote}...`));
      
      await client.mkdir(options.remote);
      
      console.log(chalk.green('✓ Directory created successfully'));
      
      client.disconnect();
    } catch (err) {
      console.error(chalk.red('✗ Error:'), err.message);
      client.disconnect();
      process.exit(1);
    }
  });

program.parse(process.argv);
