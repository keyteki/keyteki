/*global describe, it, beforeEach, expect*/
/* eslint no-invalid-this: 0 */

const ActionWindow = require('../../../server/game/gamesteps/actionwindow.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('ActionWindow', function() {
    beforeEach(function() {
        this.game = new Game('1', 'Test Game');
        this.player1 = new Player('1', 'Player 1', true, this.game);
        this.player2 = new Player('2', 'Player 2', false, this.game);
        this.player2.firstPlayer = true;
        this.game.players[0] = this.player1;
        this.game.players[1] = this.player2;

        this.prompt = new ActionWindow(this.game);
    });

    it('should prompt in first player order', function() {
        expect(this.prompt.currentPlayer).toBe(this.player2);
    });

    describe('onMenuCommand()', function() {
        describe('when it is the current player',function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.player2);
            });

            it('should make the next player be the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });

        describe('when it is not the current player',function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.player1);
            });

            it('should not change the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });
        });
    });

    describe('onCardClicked()', function() {
        describe('when a player takes an action', function() {
            beforeEach(function() {
                // Complete the window for player 2
                this.prompt.onMenuCommand(this.player2);

                // Player 1 clicks something
                this.prompt.onCardClicked(this.player1);
            });

            it('should not change the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });

            it('should re-prompt other players once the current player is done', function() {
                this.prompt.onMenuCommand(this.player1);
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should require two consecutive passes before completing', function() {
                // Complete after taking action
                this.prompt.onMenuCommand(this.player1);
                // Complete without taking action
                this.prompt.onMenuCommand(this.player2);

                expect(this.prompt.isComplete()).toBe(false);
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });
    });

    describe('continue()', function() {
        describe('when not all players are done', function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.player2);
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when all players are done', function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.player2);
                this.prompt.onMenuCommand(this.player1);
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });
    });
});
