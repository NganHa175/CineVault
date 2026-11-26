import fs from 'node:fs';
import path from 'node:path';

// Trich xuat cac file src/ tu dump "docs/figmaCinevault.txt" (UI goc tu Figma Make)
// va ghi vao frontend/src/ giu nguyen cau truc. KHONG ghi de bat ky file nao dang ton tai.
const SRC = 'c:/Users/ngan/Downloads/figmaCinevault.txt';
const FE_SRC = 'c:/Users/ngan/OneDrive/Desktop/year_4/hk1/project/CineVault/frontend/src';
const OUT = 'c:/Users/ngan/OneDrive/Desktop/year_4/hk1/project/CineVault/docs/tools/extract_report.txt';

const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const writtenReport = [];
const skipExists = [];
const ignoredHeaders = [];
const pkgSet = new Set();
let wrote = 0;
let skipped = 0;

let current = null;
let inFence = false;

function finalize(block) {
  const header = block.header;
  if (!header || !header.startsWith('src/')) {
    if (header) ignoredHeaders.push(header);
    return;
  }
  const content = block.content.join('\n');
  for (const m of content.matchAll(/from\s+["']([^"']+)["']/g)) {
    const v = m[1];
    if (!v.startsWith('.') && !v.startsWith('@/')) pkgSet.add(v);
  }
  const dest = path.join(FE_SRC, header.slice('src/'.length));
  if (fs.existsSync(dest)) {
    skipped++;
    skipExists.push(header);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  wrote++;
  writtenReport.push(header + ' (' + block.content.length + ' lines)');
}

for (const line of lines) {
  const t = line.trim();
  if (!inFence) {
    if (t.startsWith('## ')) {
      current = { header: t.slice(3).trim(), content: [] };
    } else if (current && t.startsWith('```')) {
      inFence = true;
    }
  } else {
    if (t === '```') {
      inFence = false;
      finalize(current);
      current = null;
    } else if (current) {
      current.content.push(line);
    }
  }
}

const out = [];
out.push('=== WRITTEN: ' + wrote + ' ===');
out.push(...writtenReport);
out.push('=== SKIPPED (already exist): ' + skipped + ' ===');
out.push(...skipExists);
out.push('=== IGNORED non-src headers ===');
out.push(...ignoredHeaders);
out.push('=== PACKAGES REFERENCED ===');
out.push(...[...pkgSet].sort());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out.join('\r\n'), 'utf8');
console.log('done wrote=' + wrote + ' skipped=' + skipped + ' pkgs=' + pkgSet.size);
