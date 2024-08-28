const { execSync } = require('child_process');
const depcheck = require('depcheck');

const options = {
  ignoreBinPackage: false,
  skipMissing: false,
  ignorePatterns: [],
};

const packagesToKeep = [
  'eslint',
  'eslint-config-airbnb-base',
  'eslint-plugin-import',
  'eslint-plugin-jest'
];

depcheck(process.cwd(), options, (unused) => {
  const unusedDependencies = [
    ...unused.dependencies,
    ...unused.devDependencies
  ].filter(dep => !packagesToKeep.includes(dep));

  if (unusedDependencies.length > 0) {
    console.log('Removing unused dependencies:', unusedDependencies.join(', '));
    execSync(`npm uninstall ${unusedDependencies.join(' ')}`);
    console.log('Unused dependencies removed successfully.');
  } else {
    console.log('No unused dependencies found (excluding specified packages to keep).');
  }
});