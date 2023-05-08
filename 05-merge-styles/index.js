const fs = require('fs/promises');
const path = require('path');

async function createBundle() {
  const files = await fs.readdir(path.join(__dirname, 'styles'), {
    encoding: 'utf-8',
    withFileTypes: true,
  });
  const cssFiles = files.filter((file) => {
    return file.isFile() && path.extname(file.name) === '.css';
  });
  let bundle = '';
  for (const file of cssFiles) {
    bundle += await fs.readFile(
      path.join(__dirname, 'styles', file.name),
      'utf-8'
    );
  }
  fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), bundle);
}
createBundle();
