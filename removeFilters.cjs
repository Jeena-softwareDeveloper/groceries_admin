const fs = require('fs');
const file = 'c:/Users/HP/Documents/groceries/superadmin/src/pages/AdminExtras.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<button className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-50">\s*<Filter size=\{16\} \/> Filters\s*<\/button>/g;

content = content.replace(regex, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Removed Filters button from AdminExtras');
