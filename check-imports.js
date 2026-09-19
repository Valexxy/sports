const fs = require('fs');
const path = require('path');

function checkImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.') || importPath.startsWith('@/')) {
          let resolvedPath = importPath.startsWith('@/') 
            ? path.join(__dirname, importPath.substring(2))
            : path.resolve(path.dirname(fullPath), importPath);
            
          let found = false;
          const extensions = ['', '.tsx', '.ts', '/index.tsx', '/index.ts'];
          let finalPath = '';
          for (const ext of extensions) {
            if (fs.existsSync(resolvedPath + ext)) {
              finalPath = resolvedPath + ext;
              found = true;
              break;
            }
          }
          
          if (found) {
            const dirName = path.dirname(finalPath);
            const baseName = path.basename(finalPath);
            const actualFiles = fs.readdirSync(dirName);
            if (!actualFiles.includes(baseName)) {
              const actualMatch = actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase());
              console.error(`CASE MISMATCH in ${fullPath}: imported '${importPath}', real file is '${actualMatch}'`);
            }
          } else {
             console.error(`MISSING FILE in ${fullPath}: '${importPath}'`);
          }
        }
      }
    }
  }
}
checkImports('app');
checkImports('components');
checkImports('lib');
console.log('Done checking imports.');
