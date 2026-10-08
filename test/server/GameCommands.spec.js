const GameCommands = require('../../server/game/GameCommands');

describe('GameCommands', function () {
    it('accepts commands defined on the class', function () {
        expect(GameCommands.isCommand('cardClicked')).toBe(true);
        expect(GameCommands.isCommand('menuButton')).toBe(true);
        expect(GameCommands.isCommand('concede')).toBe(true);
    });

    it('rejects internal game methods', function () {
        expect(GameCommands.isCommand('selectDeck')).toBe(false);
        expect(GameCommands.isCommand('initialise')).toBe(false);
        expect(GameCommands.isCommand('recordWinner')).toBe(false);
        expect(GameCommands.isCommand('watch')).toBe(false);
        expect(GameCommands.isCommand('endRound')).toBe(false);
    });

    it('rejects inherited and non-string commands', function () {
        expect(GameCommands.isCommand('constructor')).toBe(false);
        expect(GameCommands.isCommand('isCommand')).toBe(false);
        expect(GameCommands.isCommand('toString')).toBe(false);
        expect(GameCommands.isCommand('__proto__')).toBe(false);
        expect(GameCommands.isCommand('hasOwnProperty')).toBe(false);
        expect(GameCommands.isCommand(undefined)).toBe(false);
        expect(GameCommands.isCommand(['cardClicked'])).toBe(false);
    });

    it('forwards to the game with the sending player name', function () {
        const game = { cardClicked: vi.fn() };
        const commands = new GameCommands(game);

        commands.cardClicked('player1', 'uuid-1');

        expect(game.cardClicked).toHaveBeenCalledWith('player1', 'uuid-1');
    });

    describe('manual mode commands', function () {
        let game;
        let commands;

        beforeEach(function () {
            game = {
                manualMode: false,
                changeActiveHouse: vi.fn(),
                changeStat: vi.fn(),
                modifyKey: vi.fn()
            };
            commands = new GameCommands(game);
        });

        it('are ignored outside manual mode', function () {
            commands.changeActiveHouse('player1', 'brobnar');
            commands.changeStat('player1', 'amber', 1);
            commands.modifyKey('player1', 'red', false);

            expect(game.changeActiveHouse).not.toHaveBeenCalled();
            expect(game.changeStat).not.toHaveBeenCalled();
            expect(game.modifyKey).not.toHaveBeenCalled();
        });

        it('are forwarded in manual mode', function () {
            game.manualMode = true;

            commands.changeActiveHouse('player1', 'brobnar');
            commands.changeStat('player1', 'amber', 1);
            commands.modifyKey('player1', 'red', false);

            expect(game.changeActiveHouse).toHaveBeenCalledWith('player1', 'brobnar');
            expect(game.changeStat).toHaveBeenCalledWith('player1', 'amber', 1);
            expect(game.modifyKey).toHaveBeenCalledWith('player1', 'red', false);
        });
    });
});
