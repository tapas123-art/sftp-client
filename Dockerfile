FROM electronuserland/builder:wine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for Linux and Windows (macOS requires actual Mac hardware)
CMD ["npx", "electron-builder", "--linux", "--win"]
