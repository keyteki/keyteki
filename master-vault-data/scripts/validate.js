// Checks the pack files and overrides for problems. Also run as part of the keyteki test suite.
// Usage: npm run validate
const { validatePacks } = require('../src/validate');

const errors = validatePacks();
for (const error of errors) {
    console.error(error);
}

console.info(errors.length === 0 ? 'Pack data is valid' : `${errors.length} problems found`);
process.exit(errors.length === 0 ? 0 : 1);
