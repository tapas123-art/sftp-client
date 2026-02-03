const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SFTPClient = require('./sftp');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { host, port, username, password, privateKeyPath, remotePath } = req.body;

    // Validate required fields
    if (!host || !username || !remotePath) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: host, username, and remotePath are required' 
      });
    }

    if (!password && !privateKeyPath) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Either password or private key path must be provided' 
      });
    }

    const client = new SFTPClient();

    // Prepare connection config
    const config = {
      host: host,
      port: parseInt(port) || 22,
      username: username,
    };

    if (password) {
      config.password = password;
    } else if (privateKeyPath) {
      config.privateKey = privateKeyPath;
    }

    // Connect to SFTP server
    await client.connect(config);

    // Upload the file
    const localPath = req.file.path;
    await client.upload(localPath, remotePath);

    // Clean up local file
    fs.unlinkSync(localPath);

    // Disconnect
    client.disconnect();

    res.json({ 
      success: true, 
      message: `File uploaded successfully to ${remotePath}`,
      filename: req.file.originalname
    });

  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Upload failed' 
    });
  }
});

// Download endpoint
app.post('/download', async (req, res) => {
  try {
    const { host, port, username, password, privateKeyPath, remotePath } = req.body;

    // Validate required fields
    if (!host || !username || !remotePath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: host, username, and remotePath are required' 
      });
    }

    if (!password && !privateKeyPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either password or private key path must be provided' 
      });
    }

    const client = new SFTPClient();

    // Prepare connection config
    const config = {
      host: host,
      port: parseInt(port) || 22,
      username: username,
    };

    if (password) {
      config.password = password;
    } else if (privateKeyPath) {
      config.privateKey = privateKeyPath;
    }

    // Connect to SFTP server
    await client.connect(config);

    // Create temporary download path
    const downloadDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const filename = path.basename(remotePath);
    const localPath = path.join(downloadDir, Date.now() + '-' + filename);

    // Download the file
    await client.download(remotePath, localPath);

    // Disconnect
    client.disconnect();

    // Send file to client
    res.download(localPath, filename, (err) => {
      // Clean up file after download
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      if (err) {
        console.error('Download error:', err);
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Download failed' 
    });
  }
});

// List directory endpoint
app.post('/list', async (req, res) => {
  try {
    const { host, port, username, password, privateKeyPath, remotePath } = req.body;

    // Validate required fields
    if (!host || !username || !remotePath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: host, username, and remotePath are required' 
      });
    }

    if (!password && !privateKeyPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either password or private key path must be provided' 
      });
    }

    const client = new SFTPClient();

    // Prepare connection config
    const config = {
      host: host,
      port: parseInt(port) || 22,
      username: username,
    };

    if (password) {
      config.password = password;
    } else if (privateKeyPath) {
      config.privateKey = privateKeyPath;
    }

    // Connect to SFTP server
    await client.connect(config);

    // List directory
    const files = await client.list(remotePath);

    // Disconnect
    client.disconnect();

    res.json({ 
      success: true, 
      files: files.map(f => ({
        name: f.filename,
        size: f.attrs.size,
        isDirectory: f.longname.startsWith('d'),
        permissions: f.longname
      }))
    });

  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to list directory' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SFTP Client Web UI running at http://localhost:${PORT}`);
  console.log(`📁 Open your browser and navigate to the URL above\n`);
});
