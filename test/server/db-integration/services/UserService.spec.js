const { db, resetDatabase } = require('../helpers/database');
const ConfigService = require('../../../../server/services/ConfigService');
const UserService = require('../../../../server/services/UserService');

describe('UserService', function () {
    /** @type {UserService} */
    let userService;
    /** @type {{ id: number }} */
    let added;

    beforeEach(async function () {
        await resetDatabase();
        userService = new UserService(new ConfigService());
        added = await userService.addUser({
            username: 'Player',
            password: 'hash',
            email: 'player@example.com',
            registered: new Date(),
            registerIp: '127.0.0.1',
            verified: true
        });
    });

    it('should find an added user by username, ignoring case, with the column defaults', async function () {
        const user = /** @type {any} */ (await userService.getUserByUsername('player'));

        expect(user.id).toBe(added.id);
        expect(user.email).toBe('player@example.com');
        expect(user.settings.background).toBe('Brobnar');
        expect(user.settings.optionSettings.emailUpdates).toBe(true);
    });

    it('should report the username and email as taken', async function () {
        expect(await userService.doesUserExist('PLAYER')).toBe(true);
        expect(await userService.doesEmailExist('player@example.com')).toBe(true);
        expect(await userService.doesUserExist('someone-else')).toBe(false);
    });

    it('should keep the reference data the baseline migration added', async function () {
        const [{ count }] = await db.query('SELECT count(*)::int AS count FROM "Roles"');

        expect(count).toBeGreaterThan(0);
    });
});
