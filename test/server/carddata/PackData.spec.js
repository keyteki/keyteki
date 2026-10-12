const { validatePacks } = require('../../../master-vault-data/src/validate');

describe('Pack data', function () {
    it('has no problems and every override applied', function () {
        expect(validatePacks()).toEqual([]);
    });
});
