const path = require('path');
const fs = require('fs/promises');

async function replaceHtmlVars(template, vars) {
  let temp = template;
  for (const varName of vars) {
    const varValue = await fs.readFile(
      path.join(__dirname, 'components', `${varName}.html`),
      'utf-8'
    );
    temp = temp.replaceAll(`{{${varName}}}`, varValue);
  }
  return temp;
}

async function createCSSBundle() {
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
  fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), bundle);
}

async function dirCopy(folder, newFolderPath) {
  await fs.mkdir(newFolderPath, { recursive: true });
  await fs.mkdir(path.join(newFolderPath, path.basename(folder)), {
    recursive: true,
  });
  const filesToCopy = await fs.readdir(folder, {
    encoding: 'utf-8',
    withFileTypes: true,
  });
  for (const fileToCopy of filesToCopy) {
    if (fileToCopy.isFile()) {
      await fs.copyFile(
        path.join(folder, fileToCopy.name),
        path.join(newFolderPath, path.basename(folder), fileToCopy.name)
      );
    } else {
      await dirCopy(
        path.join(folder, fileToCopy.name),
        path.join(newFolderPath, path.basename(folder))
      );
    }
  }
}

async function bundle() {
  await fs.rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  });
  await dirCopy(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist')
  );
  const template = await fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8'
  );
  let vars = new Set(
    template
      .split('{{')
      .filter((e) => e.includes('}}'))
      .map((e) => e.slice(0, e.indexOf('}}')))
  );
  const readyHtml = await replaceHtmlVars(template, vars);
  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), readyHtml);
  await createCSSBundle();
}

bundle();
