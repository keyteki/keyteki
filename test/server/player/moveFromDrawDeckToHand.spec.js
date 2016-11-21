/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('the Player', () => {
    var player = new Player('1', 'Player 1', true);
    var drawDeck = [
      { uuid: '1111' },
      { uuid: '2222' },
      { uuid: '333' }
    ];
    var cardToMove = drawDeck[1];

    beforeEach(() => {
        player.initialise();
        player.drawDeck = _(drawDeck);
        player.hand = [];
    });

    describe('the moveFromDrawDeckToHand() function', () => {
        it('should add the card to the players hand', () => {
            player.moveFromDrawDeckToHand(cardToMove);

            expect(player.hand).toContain(cardToMove);
        });

        it('should remove the card from the draw deck', () => {
            player.moveFromDrawDeckToHand(cardToMove);

            expect(player.drawDeck).not.toContain(cardToMove);
        });
    });
});
