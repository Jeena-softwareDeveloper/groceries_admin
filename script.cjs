const fs = require('fs');
const file = 'c:/Users/HP/Documents/groceries/superadmin/src/pages/AdminExtras.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('PageHeader')) {
  content = content.replace('import { Modal, ImageUpload } from \'../components/ui\';', 'import { Modal, ImageUpload, PageHeader } from \'../components/ui\';');
}

const regex = /<div className="flex justify-between items-center mb-6">[\s\S]*?<h1 className="m-0 text-2xl text-slate-900 font-bold">([^<]+)<\/h1>\s*<div className="flex items-center gap-3">\s*([\s\S]*?)<\/div>\s*<\/div>/g;

content = content.replace(regex, (match, title, actions) => {
  return `      <PageHeader 
        title="${title}"
        description=""
        action={
          <div className="flex items-center gap-3">
            ${actions.trim()}
          </div>
        }
      />`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('AdminExtras updated successfully');
