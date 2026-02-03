const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const SFTPClient = require('./sftp');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'build', 'icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// File selection dialog
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Select file to upload'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Private key selection dialog
ipcMain.handle('select-private-key', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Select SSH private key',
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Key Files', extensions: ['pem', 'key', 'ppk'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Save file dialog for downloads
ipcMain.handle('save-file-dialog', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save downloaded file',
    defaultPath: defaultName
  });
  
  if (!result.canceled) {
    return result.filePath;
  }
  return null;
});

// Upload file handler
ipcMain.handle('upload-file', async (event, config) => {
  const client = new SFTPClient();
  
  try {
    const { host, port, username, password, privateKeyPath, localPath, remotePath } = config;
    
    console.log('[Upload] Connecting to:', host, 'port:', port);
    
    // Connect to SFTP server
    await client.connect({
      host,
      port: parseInt(port) || 22,
      username,
      password: password || undefined,
      privateKey: privateKeyPath || undefined
    });
    
    console.log('[Upload] Connected successfully, uploading file...');
    
    // Ensure remote path includes filename
    let finalRemotePath = remotePath;
    if (!remotePath.includes(path.basename(localPath))) {
      // If remote path is just a directory, append filename
      finalRemotePath = remotePath.endsWith('/') 
        ? remotePath + path.basename(localPath)
        : remotePath + '/' + path.basename(localPath);
    }
    
    console.log('[Upload] Uploading to:', finalRemotePath);
    
    // Upload the file
    await client.upload(localPath, finalRemotePath);
    
    console.log('[Upload] Upload complete');
    
    // Disconnect
    client.disconnect();
    
    return { success: true, message: `File uploaded successfully to ${finalRemotePath}` };
  } catch (error) {
    console.error('[Upload] Error:', error);
    client.disconnect();
    return { success: false, message: error.message || 'Upload failed' };
  }
});

// Download file handler
ipcMain.handle('download-file', async (event, config) => {
  const client = new SFTPClient();
  
  try {
    const { host, port, username, password, privateKeyPath, remotePath, localPath } = config;
    
    // Connect to SFTP server
    await client.connect({
      host,
      port: parseInt(port) || 22,
      username,
      password: password || undefined,
      privateKey: privateKeyPath || undefined
    });
    
    // Download the file
    await client.download(remotePath, localPath);
    
    // Disconnect
    client.disconnect();
    
    return { success: true, message: 'File downloaded successfully!' };
  } catch (error) {
    client.disconnect();
    return { success: false, message: error.message };
  }
});

// List directory handler
ipcMain.handle('list-directory', async (event, config) => {
  const client = new SFTPClient();
  
  try {
    const { host, port, username, password, privateKeyPath, remotePath } = config;
    
    // Connect to SFTP server
    await client.connect({
      host,
      port: parseInt(port) || 22,
      username,
      password: password || undefined,
      privateKey: privateKeyPath || undefined
    });
    
    // List directory
    const files = await client.list(remotePath);
    
    // Disconnect
    client.disconnect();
    
    return {
      success: true,
      files: files.map(f => ({
        name: f.filename,
        size: f.attrs.size,
        isDirectory: f.longname.startsWith('d'),
        permissions: f.longname
      }))
    };
  } catch (error) {
    client.disconnect();
    return { success: false, message: error.message };
  }
});
