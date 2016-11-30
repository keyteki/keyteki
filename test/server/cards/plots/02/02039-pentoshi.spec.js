/* global describe, it, expect, beforeEach */
/* eslint no-invalid-this: 0 */

const Game = require('../../../../../server/game/game.js');
const Player = require('../../../../../server/game/player.js');
const cards = require('../../../../../server/game/cards');

describe('Trading With The Pentoshi', function() {
    beforeEach(function() {
        this.game = new Game('1', 'Test Game');
        this.player1 = new Player('1', 'Player 1', true, this.game);
        this.player2 = new Player('2', 'Player 2', false, this.game);
        this.pentoshi = new cards['02039'](this.player1, {text: 'When Revealed: something something 3 gold'});

        this.player1.gold = 0;
        this.player2.gold = 0;

        this.game.players['1'] = this.player1;
        this.game.players['2'] = this.player2;

        this.game.initialise();
    });

    describe('onReveal()', function() {
        describe('when not in player', function() {
            beforeEach(function() {
                this.pentoshi.inPlay = false;
            });

            it('should not give the player 3 gold', function() {
                this.pentoshi.onReveal(this.player1);
                expect(this.player1.gold).toBe(0);
            });

            it('should not give the opponents 3 gold', function() {
                this.pentoshi.onReveal(this.player1);
                expect(this.player2.gold).toBe(0);
            });
        });

        describe('when in play', function() {
            beforeEach(function() {
                this.pentoshi.inPlay = true;
            });

            it('should not give the player 3 gold', function() {
                this.pentoshi.onReveal(this.player1);
                expect(this.player1.gold).toBe(0);
            });

            it('should give the opponents 3 gold', function() {
                this.pentoshi.onReveal(this.player1);
                expect(this.player2.gold).toBe(3);
            });
        });
    });
});
