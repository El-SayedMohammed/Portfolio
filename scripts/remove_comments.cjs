const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', 'portfoliogenie', 'src');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const ext = path.extname(filePath);
  if (ext === '.css') {
    // Remove CSS comments /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (ext === '.js' || ext === '.jsx') {
    // Remove JSX comments {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Remove single line comments // ...
    // Note: be careful with URLs like http://
    // Regex matches // not preceded by :
    content = content.replace(/(?<!:)\/\/.*$/gm, '');
    
    // Remove multi-line JS comments /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  
  // Remove empty lines created by comment deletion (more than 2 consecutive newlines -> 2)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      if (['.js', '.jsx', '.css'].includes(path.extname(fullPath))) {
        cleanFile(fullPath);
      }
    }
  }
}

traverse(srcDir);
console.log('Comments removed.');
