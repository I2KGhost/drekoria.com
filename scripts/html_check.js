const fs = require('fs');
const glob = require('glob');
const { HTMLHint } = require('htmlhint');

const files = glob.sync('**/*.html', { ignore: ['node_modules/**'] });
let errorCount = 0;

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const messages = HTMLHint.verify(html);
  if (messages.length > 0) {
    console.log(`\n${file}`);
    messages.forEach(m => {
      console.log(`${file}:${m.line}:${m.col} [${m.rule.id}] ${m.message}`);
      errorCount += 1;
    });
  }
});

if (errorCount > 0) {
  console.error(`\nHTMLHint found ${errorCount} error(s).`);
  process.exit(1);
} else {
  console.log('All HTML files pass HTMLHint.');
}
