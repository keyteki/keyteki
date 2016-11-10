const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('Trading With The Pentoshi', () => {
    var game = {};
    var player1 = new Player('1', 'Player 1', true);
    var player2 = new Player('2', 'Player 2', false);
    var pentoshi = { code: '02039', label: 'Test Pentoshi Plot'};
    var testPlot = { code: '0000', label: 'Test Plot With No Effects'};

    beforeEach(() => {
        player1.plotCards = [ testPlot, pentoshi ];
        player2.plotCards = [ testPlot, pentoshi ];

        game = new Game('1', 'Test Game');
        game.players['1'] = player1;
        game.players['2'] = player2;

        game.initialise();
    });

    afterEach(() => {
        game.doneRound(player1.id);
        game.doneRound(player2.id);
    });

    describe('When a player has trading revealed and that player is first player', () => {
        it('should give the other player 3 gold', () => {
            game.selectPlot(player1.id, pentoshi);                 
            game.selectPlot(player2.id, testPlot);
            
            game.setFirstPlayer(player1.id, 'me');

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(0);
        });
    });

    describe('When a player has trading revealed and the other player is first player', () => {
        it('should give the other player 3 gold', () => {
            game.selectPlot(player1.id, pentoshi);                 
            game.selectPlot(player2.id, testPlot);
            
            game.setFirstPlayer(player1.id, 'other');

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(0);
        });
    });

    describe('When both players have trading revealed and that player is first player', () => {
        it('should give both players 3 gold', () => {
            game.selectPlot(player1.id, pentoshi);
            game.selectPlot(player2.id, pentoshi);
            
            game.setFirstPlayer(player1.id, 'me');

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(3);
        });
    });
});
