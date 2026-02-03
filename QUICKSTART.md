# Quick Start Guide - SFTP Desktop Client

## Installation & Setup

### 1. Development Mode

```bash
# Install dependencies
npm install

# Run the desktop app
npm start
```

The application window will open automatically!

### 2. Build Installers

```bash
# Build for your current platform
npm run build:linux   # If on Linux
npm run build:mac     # If on macOS  
npm run build:win     # If on Windows

# Or build for all platforms at once
npm run build
```

## Using the Application

### First Time Setup

1. **Launch the app** - Double-click the installed application or run `npm start`
2. **Choose a tab** - Upload, Download, or Browse

### Upload Files

1. Click **Upload** tab
2. Fill in connection details:
   - Host: `your-server.com`
   - Username: `your-username`
   - Password: `your-password` (or use SSH key)
3. Click **Browse for File...** to select file
4. Enter remote path: `/remote/directory/filename.ext`
5. Click **Upload File**

### Download Files

1. Click **Download** tab
2. Fill in connection details
3. Enter remote file path: `/remote/file.txt`
4. Click **Download File**
5. Choose where to save using the file picker

### Browse Remote Server

1. Click **Browse** tab
2. Fill in connection details
3. Enter directory path: `/` (or specific path)
4. Click **Browse Directory**
5. View all files and folders

## Distribution

### Linux
- **AppImage**: Portable, works on any Linux distro
  ```bash
  chmod +x SFTP-Client-1.0.0.AppImage
  ./SFTP-Client-1.0.0.AppImage
  ```
- **DEB**: For Debian/Ubuntu
  ```bash
  sudo dpkg -i sftp-client_1.0.0_amd64.deb
  ```

### macOS
- **DMG**: Standard macOS installer
  - Open the DMG
  - Drag app to Applications
  - Launch from Applications

### Windows
- **Setup.exe**: Standard installer with shortcuts
- **Portable.exe**: No installation needed, run directly

## Tips

- **SSH Keys**: More secure than passwords
  - Linux/Mac: `~/.ssh/id_rsa`
  - Windows: `C:\Users\YourName\.ssh\id_rsa`

- **Connection Saves**: The app doesn't save passwords for security
  - You'll need to enter credentials each time

- **File Permissions**: On Linux/Mac, ensure SSH keys have proper permissions:
  ```bash
  chmod 600 ~/.ssh/id_rsa
  ```

## Troubleshooting

**App won't start?**
- Check Node.js is installed: `node --version`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Can't connect to server?**
- Check server address and port
- Verify firewall isn't blocking connections
- Test with command line: `ssh username@server.com`

**Permission denied?**
- Check username and password
- Verify SSH key path is correct
- Ensure remote directory exists and is writable

## Development

**Enable Developer Tools:**
Edit `main.js` and uncomment:
```javascript
mainWindow.webContents.openDevTools();
```

**Build from source:**
```bash
git clone <your-repo>
cd sftp-client
npm install
npm start
```

Need help? Check the main [README.md](README.md) for detailed documentation.
