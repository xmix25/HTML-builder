const path = require('path');
const fsP = require('fs/promises');

async function showFiles(folder = 'secret-folder') {
  const entry = await fsP.readdir(path.join(__dirname, folder), {
    encoding: 'utf-8',
    withFileTypes: true,
  });
  const files = entry.filter((file) => file.isFile());
  files.forEach(async (file) => {
    const info = await fsP.stat(path.join(__dirname, folder, file.name));
    const size = info.size;
    console.log(
      `${file.name.slice(0, file.name.indexOf('.'))} - ${path
        .extname(file.name)
        .slice(1)} - ${size}`
    );
  });
}

showFiles();
