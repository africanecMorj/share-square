const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

module.exports = (outputPath, files) => {
  return new Promise((resolve, reject) => {
    const zipPath = `${outputPath}.zip`;

    // Ensure output directory exists
    const dir = path.dirname(zipPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      resolve(zipPath);
    });

    archive.on('error', err => reject(err));

    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
        console.warn('Warning:', err.message);
      } else {
        reject(err);
      }
    });

    archive.pipe(output);

    try {
      files.forEach(file => {
        if (!fs.existsSync(file)) {
          throw new Error(`File not found: ${file}`);
        }
        archive.file(file, { name: path.basename(file) });
      });
    } catch (err) {
      return reject(err);
    }

    archive.finalize();
  });
};


