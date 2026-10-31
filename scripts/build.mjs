import { mkdir, writeFile } from 'node:fs/promises';
import { siteTitle, releaseLabel } from '../src/config.mjs';

const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(siteTitle)}</title><style>
body { font: 16px system-ui, sans-serif; margin: 0; background: #0f172a; color: #e2e8f0; }
main { max-width: 640px; margin: 12vh auto; padding: 2rem; border: 1px solid #334155; border-radius: 16px; background: #1e293b; }
h1 { margin-top: 0; } p { line-height: 1.6; } code { color: #7dd3fc; }
</style></head><body><main><h1>${escapeHtml(siteTitle)}</h1>
<p>Real deployment from GitHub Actions to GitHub Pages.</p>
<p>Release: <strong>${escapeHtml(releaseLabel)}</strong></p>
<p>Test in Sprint: repository → pipelines → jobs → logs → artifacts → deployments.</p>
<p><code>Do not store secrets in this demo.</code></p></main></body></html>`;
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html, 'utf8');
console.log('Built dist/index.html successfully');
