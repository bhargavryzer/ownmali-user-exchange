const fs = require('fs');
const path = require('path');

const pkgDir = path.join(__dirname, '..', 'node_modules', 'lightningcss', 'pkg');
const target = path.join(pkgDir, 'index.js');

const content = "module.exports = require('lightningcss-wasm');\n";

try {
  if (!fs.existsSync(pkgDir)) {
    fs.mkdirSync(pkgDir, { recursive: true });
  }
  fs.writeFileSync(target, content, 'utf8');
  console.log('Patched lightningcss to use lightningcss-wasm fallback');
} catch (err) {
  console.error('patch-lightningcss: failed to write shim (this is non-fatal)');
  // keep install from failing
}
