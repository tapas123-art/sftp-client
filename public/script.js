// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Clear message
    hideMessage();
}

// Show/hide message
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = 'message show ' + type;
    
    // Auto hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.classList.remove('show');
}

// Check if electron API is available
if (!window.electron) {
    console.error('Electron API not available!');
}

// File browse button handler for upload
document.getElementById('upload-file')?.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
        if (!window.electron || !window.electron.selectFile) {
            showMessage('Error: File selection not available', 'error');
            return;
        }
        
        const filePath = await window.electron.selectFile();
        if (filePath) {
            const fileInfo = document.getElementById('file-info');
            const fileName = filePath.split(/[\\/]/).pop();
            fileInfo.innerHTML = `<strong>Selected:</strong> ${fileName}<br><small>${filePath}</small>`;
            fileInfo.classList.add('show');
            fileInfo.dataset.filePath = filePath;
            
            // Always append filename to the preset remote path
            const remotePathInput = document.getElementById('upload-remote-path');
            const basePath = '/home/webapp/uploads/';
            remotePathInput.value = basePath + fileName;
        }
    } catch (error) {
        console.error('File selection error:', error);
        showMessage('Error selecting file: ' + error.message, 'error');
    }
});

// Upload form handler
document.getElementById('upload-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const fileInfo = document.getElementById('file-info');
    const localPath = fileInfo.dataset.filePath;
    
    if (!localPath) {
        showMessage('Please select a file to upload', 'error');
        return;
    }
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    hideMessage();
    
    try {
        const config = {
            host: formData.get('host'),
            port: formData.get('port'),
            username: formData.get('username'),
            password: formData.get('password'),
            privateKeyPath: formData.get('privateKeyPath'),
            localPath: localPath,
            remotePath: formData.get('remotePath')
        };
        
        const result = await window.electron.uploadFile(config);
        
        if (result.success) {
            showMessage(result.message, 'success');
            this.reset();
            fileInfo.classList.remove('show');
            delete fileInfo.dataset.filePath;
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
    }
});
