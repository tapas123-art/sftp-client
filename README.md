# SFTP Client - Desktop Application

A cross-platform **desktop application** for SFTP file transfers, built with Electron and SSH2. Features a beautiful GUI that runs natively on Linux, macOS, and Windows.

## Features

- 🖥️ **Native Desktop App** - Runs as a standalone application on Linux, macOS, and Windows
- 🎨 **Modern GUI** - Beautiful, intuitive interface with file browser dialogs
- 🔐 Secure file transfer using SSH2 protocol
- 📤 Upload files with native file picker
- 📥 Download files with save dialog
- 📁 Browse remote directory contents
- 🔑 Support for password and SSH key authentication
- 💾 No browser required - true desktop experience

## Quick Start

### Run in Development Mode

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the application:
\`\`\`bash
npm start
\`\`\`

The desktop application window will open automatically.

## Building Desktop Applications

Build standalone installers and executables for all platforms:

\`\`\`bash
# Build for all platforms (Linux, macOS, Windows)
npm run build

# Or build for specific platforms:
npm run build:linux    # Creates AppImage and .deb
npm run build:mac      # Creates .dmg and .zip
npm run build:win      # Creates installer and portable .exe
\`\`\`

### Build Output

After building, you'll find the installers in the \`dist/\` folder:

**Linux:**
- \`SFTP-Client-1.0.0.AppImage\` - Portable AppImage
- \`sftp-client_1.0.0_amd64.deb\` - Debian/Ubuntu package

**macOS:**
- \`SFTP Client-1.0.0.dmg\` - DMG installer
- \`SFTP Client-1.0.0-mac.zip\` - Portable zip

**Windows:**
- \`SFTP Client Setup 1.0.0.exe\` - Installer
- \`SFTP Client 1.0.0.exe\` - Portable executable

## Usage

### Upload Files

1. Click the **Upload** tab
2. Enter your SFTP server details:
   - Host (e.g., \`sftp.example.com\`)
   - Port (default: 22)
   - Username
   - Password or Private Key Path
3. Click **Browse for File...** to select a file
4. Specify the remote destination path
5. Click **Upload File**

### Download Files

1. Click the **Download** tab
2. Enter your SFTP server details
3. Specify the remote file path
4. Click **Download File**
5. Choose where to save the file using the save dialog

### Browse Directories

1. Click the **Browse** tab
2. Enter your SFTP server details
3. Specify the directory path (e.g., \`/\` for root)
4. Click **Browse Directory**
5. View all files and folders with sizes

### Authentication

**Password Authentication:**
- Enter your password in the Password field
- Leave Private Key Path empty

**SSH Key Authentication:**
- Leave Password field empty
- Enter the path to your private key:
  - Linux: \`/home/username/.ssh/id_rsa\`
  - macOS: \`/Users/username/.ssh/id_rsa\`
  - Windows: \`C:\\Users\\username\\.ssh\\id_rsa\`

## Installation

### Linux

**AppImage (Universal):**
\`\`\`bash
chmod +x SFTP-Client-1.0.0.AppImage
./SFTP-Client-1.0.0.AppImage
\`\`\`

**Debian/Ubuntu:**
\`\`\`bash
sudo dpkg -i sftp-client_1.0.0_amd64.deb
\`\`\`

### macOS

1. Open the \`.dmg\` file
2. Drag the app to Applications folder
3. Launch from Applications

### Windows

**Installer:**
- Double-click \`SFTP Client Setup 1.0.0.exe\`
- Follow installation wizard

**Portable:**
- Run \`SFTP Client 1.0.0.exe\` directly

## Project Structure

\`\`\`
sftp-client/
├── main.js           # Electron main process
├── preload.js        # Electron preload script (IPC bridge)
├── sftp.js           # SFTP client implementation
├── package.json      # Project configuration
├── public/           # UI files
│   ├── index.html    # Application interface
│   ├── style.css     # Styling
│   └── script.js     # UI logic
└── dist/             # Built applications (after build)
    ├── linux/
    ├── mac/
    └── win-unpacked/
\`\`\`

## Dependencies

- **electron**: Cross-platform desktop application framework
- **ssh2**: SSH2 client for secure SFTP connections
- **electron-builder**: Package and build for distribution

## System Requirements

- **Linux**: Ubuntu 18.04+, Fedora 32+, Debian 10+
- **macOS**: macOS 10.14 (Mojave) or later
- **Windows**: Windows 10 or later

## Security Notes

- SSH keys are read securely from your local filesystem
- Passwords are never stored or logged
- All connections use SSH2 encryption
- File transfers are secure and encrypted
- Store SSH keys with proper permissions (chmod 600 on Linux/macOS)

## Troubleshooting

### Linux

**AppImage won't run:**
\`\`\`bash
chmod +x SFTP-Client-1.0.0.AppImage
\`\`\`

**Permission issues:**
\`\`\`bash
chmod 600 ~/.ssh/id_rsa
\`\`\`

### macOS

**"App can't be opened" error:**
1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog

**Key permissions:**
\`\`\`bash
chmod 600 ~/.ssh/id_rsa
\`\`\`

### Windows

**SmartScreen warning:**
1. Click "More info"
2. Click "Run anyway"

**Private key format:**
- Use OpenSSH format keys
- Convert PuTTY \`.ppk\` keys using PuTTYgen

### Connection Issues

- Verify server is accessible
- Check firewall settings
- Confirm correct port (default: 22)
- Verify username and credentials
- Check remote path permissions

## Development

### Prerequisites
- Node.js 16 or later
- npm or yarn

### Run in Dev Mode
\`\`\`bash
npm install
npm start
\`\`\`

### Debug
Uncomment this line in main.js:
\`\`\`javascript
mainWindow.webContents.openDevTools();
\`\`\`

## License

MIT
