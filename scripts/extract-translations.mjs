import ts from 'typescript';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['apps/web/src', 'packages/game/src', 'packages/challenges/src', 'packages/arcade/src', 'packages/learning-engine/src'];
const entries = new Map();
const persian = /[\u0600-\u06ff]/;
function add(text, file, kind) {
  if (!persian.test(text)) return;
  const key = text.trim();
  if (!entries.has(key)) entries.set(key, { key, file, kind });
}
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.tsx?$/.test(file) || /\.test\./.test(file)) continue;
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node.text, file, /export |return |<\w|\n/.test(node.text) ? 'code-or-multiline' : 'text');
      else if (ts.isJsxText(node)) add(node.text, file, 'jsx');
      else if (ts.isTemplateExpression(node)) {
        let key = node.head.text;
        node.templateSpans.forEach((span, index) => { key += `{${index}}${span.literal.text}`; });
        add(key, file, 'template');
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
roots.forEach(scan);
const list = [...entries.values()].map((entry, index) => ({ index, ...entry }));
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/translation-inventory.json', JSON.stringify(list, null, 2));
for (const root of roots) {
  const items = list.filter(item => item.file.startsWith(root));
  process.stdout.write(`${root}: ${items.length} strings, ${items.reduce((sum, item) => sum + item.key.length, 0)} characters\n`);
}
