const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/'http:\/\/localhost:8000\/api([^']*)'/g, 'import.meta.env.VITE_API_BASE_URL + \'/api$1\'');
    content = content.replace(/'http:\/\/localhost:8000' \+/g, 'import.meta.env.VITE_API_BASE_URL +');
    content = content.replace(/'http:\/\/localhost:8000'\+/g, 'import.meta.env.VITE_API_BASE_URL +');
    content = content.replace(/`http:\/\/localhost:8000\$\{/g, '`${import.meta.env.VITE_API_BASE_URL}${');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log('Updated: ' + file);
    }
});

console.log('Files changed: ' + changedCount);
