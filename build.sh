#!/bin/bash

# Build script using Docker for cross-platform builds

echo "Building SFTP Client for Linux and Windows..."

docker build -t sftp-client-builder .

docker run --rm -v "$(pwd)/dist:/app/dist" sftp-client-builder

echo ""
echo "Build complete! Check the dist/ folder for:"
echo "  - Linux: .AppImage, .deb files"
echo "  - Windows: .exe installer"
echo ""
echo "Note: macOS builds require actual Mac hardware or GitHub Actions"
