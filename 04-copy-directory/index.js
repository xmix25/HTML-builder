const path = require('path');
const fs = require('fs/promises');

async function dirCopy(dirPath) {
  const newFolderName = path.basename(dirPath) + '-copy';
  const newFolderPath = path.join(path.dirname(dirPath), newFolderName);
  const newFolder = await fs.mkdir(newFolderPath, {
    recursive: true,
  });
  const newFolderFiles = await fs.readdir(newFolderPath);
  for (const file of newFolderFiles) {
    await fs.rm(path.join(newFolderPath, file));
  }

  const files = await fs.readdir(dirPath);
  for (const file of files) {
    await fs.copyFile(path.join(dirPath, file), path.join(newFolderPath, file));
  }
}

dirCopy(path.join(__dirname, 'files'));
