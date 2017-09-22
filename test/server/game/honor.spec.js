const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('Game', function() {
    beforeEach(function() {
        let gameService = jasmine.createSpyObj('gameService', ['save']);
        let router = jasmine.createSpyObj('router', ['gameWon']);
        this.game = new Game('1', 'Test Game', { gameService: gameService });
        this.game.router = router;

        this.source = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);
        this.target = new Player('1', { username: 'Player 2', settings: {} }, true, this.game);
        
        this.target.honor = 1;
        this.source.honor = 2;
    });

    describe('transferHonor()', function() {
        describe('when the source has enough honor', function() {
            it('should transfer the exact amount of honor', function() {
                this.game.transferHonor(this.source, this.target, 2);

                expect(this.target.honor).toBe(3);
            });
        });

        describe('when the source does not have enough honor', function() {
            beforeEach(function() {
                this.game.transferHonor(this.source, this.target, 3);
            });

            it('should increase the target honor by the sources total honor', function() {
                expect(this.target.honor).toBe(3);
            });

            it('should set the sources honor to 0', function() {
                expect(this.source.honor).toBe(0);
            });

            it('should declare the player who dropped to 0 honor the loser', function() {
                expect(this.game.winner).toEqual(this.target);
            });
        });
    });
});
