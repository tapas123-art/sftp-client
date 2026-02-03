const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectPrivateKey: () => ipcRenderer.invoke('select-private-key'),
  saveFileDialog: (defaultName) => ipcRenderer.invoke('save-file-dialog', defaultName),
  uploadFile: (config) => ipcRenderer.invoke('upload-file', config),
  downloadFile: (config) => ipcRenderer.invoke('download-file', config),
  listDirectory: (config) => ipcRenderer.invoke('list-directory', config)
});
