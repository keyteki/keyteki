const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('the Game', () => {
    var game = {};
    var winner = {};
    var loser = {};

    beforeEach(() => {
        var gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        var router = jasmine.createSpyObj('router', ['gameWon']);
        game = new Game('1', 'Test Game', { gameRepository: gameRepository, router: router });
        winner = new Player('1', 'Player 1', true, game);
        loser = new Player('2', 'Player 2', true, game);

        winner.name = 'Player 1';
        loser.name = 'Player 2';

        game.router = router;
        game.playersAndSpectators[winner.id] = winner;
        game.playersAndSpectators[loser.id] = loser;

        game.initialise();
        winner.initialise();
        loser.initialise();
    });

    describe('the transferHonor() function', () => {
        describe('when the loser has enough honor', () => {
            it('should transfer the exact amount of honor', () => {
                winner.honor = 1;
                loser.honor = 3;

                game.transferHonor(winner, loser, 2);

                expect(winner.honor).toBe(3);
            });
        });

        describe('when the loser does not have enough honor', () => {
            beforeEach(() => {
                winner.honor = 1;
                loser.honor = 2;
                game.transferHonor(winner, loser, 3);
            });

            it('should increase the winner honor by the losers total honor', () => {
                expect(winner.honor).toBe(3);
            });

            it('should set the losers honor to 0', () => {
                expect(loser.honor).toBe(0);
            });

            it('should declare the player who dropped to 0 honor the loser', () => {
                expect(game.winner).toEqual(winner);
            });
        });
    });
});
