const fs = require('fs');
const path = require('path');

// Define absolute paths for original pkg and temporary pkg.
const ORIG_PKG_PATH = path.resolve(__dirname, '../package.json');
const CACHED_PKG_PATH = path.resolve(__dirname, '../../cached-package.json');

// Obtain original `package.json` contents.
const pkgData = require(ORIG_PKG_PATH);

// Write/cache the original `package.json` data to `cached-package.json` file.
fs.writeFile(CACHED_PKG_PATH, JSON.stringify(pkgData), function(err) {
    if (err) throw err;
});

// Remove all scripts except postpublish.
Object.keys(pkgData.scripts).forEach(function(scriptName) {
    if (scriptName !== 'postpublish' && scriptName !== 'postpack') {
        delete pkgData.scripts[scriptName];
    }
});

// Remove all pkgs from the devDependencies section.
Object.keys(pkgData.devDependencies).forEach(function(pkgName) {
    delete pkgData.devDependencies[pkgName];
});

// Remove all pkgs from the dependencies section.
Object.keys(pkgData.dependencies).forEach(function(pkgName) {
  delete pkgData.dependencies[pkgName];
});

// Overwrite original `package.json` with new data (i.e. minus the specific data).
fs.writeFile(ORIG_PKG_PATH, JSON.stringify(pkgData, null, 2), function(err) {
    if (err) throw err;
});
