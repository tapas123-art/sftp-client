# Example Usage Guide

## Testing the SFTP Client

### 1. Test with Node.js (Before Building)

```bash
# Upload a file
node index.js upload \
  --host your-sftp-server.com \
  --username your-username \
  --password your-password \
  --local ./test-file.txt \
  --remote /upload/test-file.txt

# Download a file
node index.js download \
  --host your-sftp-server.com \
  --username your-username \
  --password your-password \
  --remote /path/to/file.txt \
  --local ./downloaded-file.txt

# List directory
node index.js list \
  --host your-sftp-server.com \
  --username your-username \
  --password your-password \
  --remote /
```

### 2. Build Executables

```bash
# Build for all platforms
npm run build

# Or build for specific platforms
npm run build:linux
npm run build:macos
npm run build:windows
```

### 3. Test the Built Executables

#### On Linux/Ubuntu:
```bash
cd dist
chmod +x sftp-client-linux
./sftp-client-linux upload --host example.com --username user --password pass --local ./file.txt --remote /upload/file.txt
```

#### On macOS:
```bash
cd dist
chmod +x sftp-client-macos
./sftp-client-macos upload --host example.com --username user --password pass --local ./file.txt --remote /upload/file.txt
```

#### On Windows:
```cmd
cd dist
sftp-client-win.exe upload --host example.com --username user --password pass --local C:\file.txt --remote /upload/file.txt
```

## Advanced Examples

### Using SSH Key Authentication

```bash
# Linux/macOS
./sftp-client-linux upload \
  --host sftp.example.com \
  --username deployuser \
  --key ~/.ssh/id_rsa \
  --local ./deploy.zip \
  --remote /var/www/releases/deploy.zip

# Windows
sftp-client-win.exe upload ^
  --host sftp.example.com ^
  --username deployuser ^
  --key C:\Users\username\.ssh\id_rsa ^
  --local C:\deploy.zip ^
  --remote /var/www/releases/deploy.zip
```

### Custom Port

```bash
./sftp-client-linux upload \
  --host example.com \
  --port 2222 \
  --username user \
  --password pass \
  --local ./file.txt \
  --remote /upload/file.txt
```

### Batch Operations (Shell Script)

Create a script to upload multiple files:

```bash
#!/bin/bash

HOST="sftp.example.com"
USER="myuser"
KEY="~/.ssh/id_rsa"

for file in ./uploads/*; do
  filename=$(basename "$file")
  echo "Uploading $filename..."
  ./sftp-client-linux upload \
    --host $HOST \
    --username $USER \
    --key $KEY \
    --local "$file" \
    --remote "/destination/$filename"
done

echo "All uploads completed!"
```

## Troubleshooting

### Permission Denied
- Ensure your SSH key has proper permissions: `chmod 600 ~/.ssh/id_rsa`
- Verify your username and password/key are correct

### Connection Timeout
- Check if the server is accessible: `ping your-server.com`
- Verify the port is correct (default is 22)
- Check firewall settings

### File Not Found
- Use absolute paths for local files
- Verify remote paths exist on the server
- Check read/write permissions

## Distribution

To distribute your application:

1. Build the executables: `npm run build`
2. The executables in `dist/` folder are standalone and don't require Node.js
3. Share the appropriate executable for each platform:
   - Linux users: `sftp-client-linux`
   - macOS users: `sftp-client-macos`
   - Windows users: `sftp-client-win.exe`
4. Include the README.md for usage instructions
