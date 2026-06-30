const fs = require('fs');
const path = require('path');

const dirs = [
  '/home/shinomiya/coding/projek/mcloud/apps/frontend/src/pages',
  '/home/shinomiya/coding/projek/mcloud/apps/frontend/src/components'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('rounded-xl') || lines[i].includes('rounded-lg')) {
      // Check if it's a button or link that acts like a button
      let isButton = false;
      for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
        if (lines[j].includes('<button') || lines[j].includes('</button>') || lines[j].includes('navLinkClass') || lines[j].includes('btn-primary')) {
          isButton = true;
          break;
        }
      }
      
      // We only want to replace rounding on buttons, not cards.
      // Usually buttons have 'px-', 'py-', 'hover:', 'transition' etc.
      // Let's just replace if the line contains 'px-' or 'py-' or 'p-2' (button padding) and 'transition' or 'bg-'
      // Wait, the user said "untuk tombol" (for buttons).
      if (isButton && (lines[i].includes('className') || lines[i].includes('className='))) {
         // Exclude panels/cards which might have rounded-xl and <button> inside them.
         // Wait, a panel is usually `p-8` or `p-6` or `p-12`. Buttons are usually `px-` and `py-`.
         if (lines[i].includes('px-') || lines[i].includes('py-') || lines[i].includes('p-2') || lines[i].includes('btn-primary')) {
            lines[i] = lines[i].replace(/rounded-xl/g, 'rounded-md').replace(/rounded-lg/g, 'rounded-md');
            modified = true;
         }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Modified', filePath);
  }
}

dirs.forEach(d => {
  fs.readdirSync(d).filter(f => f.endsWith('.jsx')).forEach(f => {
    processFile(path.join(d, f));
  });
});
