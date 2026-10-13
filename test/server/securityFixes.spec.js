const { checkSecrets } = require('../../server/configCheck');
const Socket = require('../../server/socket');
const Lobby = require('../../server/lobby');
const User = require('../../server/models/User');

function fakeConfig(values, lobby = {}) {
    return {
        getValue: (key) => values[key],
        getValueForSection: (section, key) => lobby[key]
    };
}

describe('checkSecrets', function () {
    let originalNodeEnv;

    beforeEach(function () {
        originalNodeEnv = process.env.NODE_ENV;
        delete process.env.NODE_ENV;
    });

    afterEach(function () {
        process.env.NODE_ENV = originalNodeEnv;
    });

    it('refuses to start in production with default secrets', function () {
        const config = fakeConfig(
            { env: 'production', secret: 'somethingverysecret' },
            { hmacSecret: 'real' }
        );

        expect(() => checkSecrets(config)).toThrow();
    });

    it('refuses to start in production with a missing secret', function () {
        const config = fakeConfig({ env: 'production', secret: 'real' }, {});

        expect(() => checkSecrets(config)).toThrow();
    });

    it('only checks the secrets the process uses', function () {
        const config = fakeConfig({ env: 'production', secret: 'real' }, {});

        expect(() => checkSecrets(config, ['secret'])).not.toThrow();
    });

    it('only warns outside production', function () {
        const config = fakeConfig({ env: 'development', secret: 'somethingverysecret' }, {});

        expect(() => checkSecrets(config)).not.toThrow();
    });
});

describe('Socket events', function () {
    function createSocket() {
        const ioSocket = { on: vi.fn(), request: { user: { username: 'player1' } } };

        return new Socket(ioSocket, {});
    }

    it('catches rejections from async handlers', async function () {
        const socket = createSocket();
        const error = new Error('boom');
        socket.reportEventError = vi.fn();

        socket.onSocketEvent(async () => {
            throw error;
        });

        await vi.waitFor(() => expect(socket.reportEventError).toHaveBeenCalledWith(error, []));
    });
});

describe('Lobby', function () {
    describe('onClearSessions', function () {
        let lobby;

        beforeEach(function () {
            lobby = {
                userService: { clearUserSessions: vi.fn().mockResolvedValue(true) },
                findGameForUser: vi.fn(),
                sockets: {}
            };
        });

        it('does nothing for users without permission', function () {
            const socket = { user: { username: 'player1', permissions: {} } };

            Lobby.prototype.onClearSessions.call(lobby, socket, 'victim');

            expect(lobby.userService.clearUserSessions).not.toHaveBeenCalled();
        });

        it('clears sessions for user managers', async function () {
            const socket = { user: { username: 'admin', permissions: { canManageUsers: true } } };

            await Lobby.prototype.onClearSessions.call(lobby, socket, 'victim');

            expect(lobby.userService.clearUserSessions).toHaveBeenCalledWith('victim');
        });
    });

    describe('onNewGame', function () {
        function createGame(permissions) {
            const lobby = {
                games: {},
                findGameForUser: vi.fn(),
                sendGameState: vi.fn(),
                broadcastGameMessage: vi.fn()
            };
            const socket = {
                id: 'socket1',
                user: new User({ username: 'player1', permissions, blockList: [] }),
                joinChannel: vi.fn()
            };

            Lobby.prototype.onNewGame.call(lobby, socket, {
                name: 'game',
                previousWinner: 'player1',
                tournament: true,
                challonge: { matchId: 1 }
            });

            return Object.values(lobby.games)[0];
        }

        it('ignores client supplied previous winners and tournament settings', function () {
            const game = createGame({});

            expect(game.previousWinner).toBeUndefined();
            expect(game.tournament).toBeUndefined();
            expect(game.challonge).toBeUndefined();
        });

        it('allows tournament managers to create tournament games', function () {
            const game = createGame({ canManageTournaments: true });

            expect(game.previousWinner).toBeUndefined();
            expect(game.tournament).toBe(true);
            expect(game.challonge).toEqual({ matchId: 1 });
        });
    });

    describe('unsupported decks', function () {
        it('does not select a deck from an unsupported expansion', async function () {
            const game = { selectDeck: vi.fn(), gameFormat: 'casual' };
            const lobby = {
                games: { game1: game },
                cardService: { getAllCards: vi.fn().mockResolvedValue({}) },
                deckService: {
                    getById: vi.fn().mockResolvedValue({
                        id: 5,
                        username: 'player1',
                        expansion: 722,
                        cards: [],
                        usageCount: 0
                    })
                },
                configService: { getValueForSection: () => 0 },
                sendGameState: vi.fn()
            };

            await Lobby.prototype.onSelectDeck.call(
                lobby,
                { user: { username: 'player1' } },
                'game1',
                5,
                false
            );

            expect(game.selectDeck).not.toHaveBeenCalled();
            expect(lobby.sendGameState).not.toHaveBeenCalled();
        });

        it('selects a deck from a supported expansion', async function () {
            const game = { selectDeck: vi.fn(), gameFormat: 'casual' };
            const lobby = {
                games: { game1: game },
                cardService: { getAllCards: vi.fn().mockResolvedValue({}) },
                deckService: {
                    getById: vi.fn().mockResolvedValue({
                        id: 5,
                        username: 'player1',
                        expansion: 341,
                        cards: [],
                        usageCount: 0
                    })
                },
                configService: { getValueForSection: () => 0 },
                sendGameState: vi.fn()
            };

            await Lobby.prototype.onSelectDeck.call(
                lobby,
                { user: { username: 'player1' } },
                'game1',
                5,
                false
            );

            expect(game.selectDeck).toHaveBeenCalled();
            expect(lobby.sendGameState).toHaveBeenCalledWith(game);
        });

        it('does not start a game that uses an unsupported deck', function () {
            const game = {
                started: false,
                getPlayers: () => ({
                    player1: { name: 'player1', deck: { expansion: 722 } }
                }),
                isOwner: () => true
            };
            const lobby = {
                games: { game1: game },
                router: { startGame: vi.fn() }
            };

            Lobby.prototype.onStartGame.call(
                lobby,
                { user: { username: 'player1' }, send: vi.fn() },
                'game1'
            );

            expect(lobby.router.startGame).not.toHaveBeenCalled();
            expect(game.started).toBe(false);
        });
    });

    describe('onLobbyChat', function () {
        it('ignores non string messages', async function () {
            const lobby = { messageService: { addMessage: vi.fn() }, configService: {} };
            const socket = { user: { username: 'player1' } };

            await Lobby.prototype.onLobbyChat.call(lobby, socket, { message: 'hi' });

            expect(lobby.messageService.addMessage).not.toHaveBeenCalled();
        });
    });
});

describe('User.getGameNodeDetails', function () {
    it('does not include private account details', function () {
        const user = new User({
            id: 1,
            username: 'player1',
            email: 'player1@example.com',
            password: 'hash',
            patreon: { refresh_token: 'secret-token' },
            challonge: { key: 'api-key' },
            tokens: [{ token: 'refresh' }],
            settings: {},
            permissions: {}
        });

        const serialized = JSON.stringify(user.getGameNodeDetails());

        for (const value of ['player1@example.com', 'hash', 'secret-token', 'api-key', 'refresh']) {
            expect(serialized).not.toContain(value);
        }
        expect(user.getGameNodeDetails().username).toBe('player1');
    });
});
