const db = require('../../server/db');
const GameService = require('../../server/services/GameService');
const UserService = require('../../server/services/UserService');

describe('Stats persistence', function () {
    beforeEach(function () {
        this.client = {};
        this.queryTran = vi.spyOn(db, 'queryTran').mockResolvedValue([{ Id: 1 }]);
        vi.spyOn(db, 'transaction').mockImplementation((callback) => callback(this.client));
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    describe('GameService', function () {
        // "timestamp without time zone" ignores offsets, and node-pg sends a Date in the server's local time
        it('should save game times as UTC whatever the server timezone', async function () {
            const startedAt = new Date('2026-07-01T23:30:00Z');
            const finishedAt = new Date('2026-07-02T00:10:00Z');

            await new GameService().create({ gameId: 'g', players: [], startedAt });
            await new GameService().update({
                gameId: 'g',
                players: [],
                startedAt,
                finishedAt,
                winner: 'alice',
                winReason: 'keys'
            });

            expect(this.queryTran.mock.calls[0][2][3]).toBe('2026-07-01T23:30:00.000Z');
            const updateParams = this.queryTran.mock.calls[1][2];
            expect(updateParams[1]).toBe('2026-07-01T23:30:00.000Z');
            expect(updateParams[4]).toBe('2026-07-02T00:10:00.000Z');
        });

        it('should pass on times that arrive from a game node as strings', async function () {
            await new GameService().update({
                gameId: 'g',
                players: [],
                startedAt: '2026-07-01T23:30:00.000Z',
                finishedAt: null
            });

            expect(this.queryTran.mock.calls[0][2][1]).toBe('2026-07-01T23:30:00.000Z');
            expect(this.queryTran.mock.calls[0][2][4]).toBeNull();
        });
    });

    describe('UserService', function () {
        beforeEach(function () {
            this.user = {
                id: 7,
                username: 'alice',
                settings: { optionSettings: { showAccolades: true } }
            };
        });

        const emailParam = (call) => call[2][12];

        it("should leave the email setting alone when it isn't given", async function () {
            await new UserService({}).update(this.user);

            const [, sql] = this.queryTran.mock.calls[0];
            expect(sql).toContain(
                '"Settings_EmailUpdates" = COALESCE($13, "Settings_EmailUpdates")'
            );
            expect(emailParam(this.queryTran.mock.calls[0])).toBeNull();
        });

        it('should save the email setting when it is given', async function () {
            this.user.settings.optionSettings.emailUpdates = false;

            await new UserService({}).update(this.user);

            expect(emailParam(this.queryTran.mock.calls[0])).toBe(false);
        });
    });
});
