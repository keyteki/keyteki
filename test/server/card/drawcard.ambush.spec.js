/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', () => {
    var owner = {};
    var card;

    describe('the getAmbushCost() function', () => {
        describe('when the card does not have ambush', () => {
            beforeEach(() => {
                card = new DrawCard(owner, { text: 'Each Wildling character in your hand gains ambush (X). X is that cards printed cost.' });
            });

            it('should have no ambush cost', () => {
                expect(card.isAmbush()).toBe(false);
                expect(card.getAmbushCost()).toBeUndefined();
            });
        });

        describe('when the card has ambush', () => {
            beforeEach(() => {
                card = new DrawCard(owner, { text: '[thenightswatch] character only. Ambush (2).\r\nAttached character gets +1 STR and gains a [military] icon.' });
            });

            it('should parse the ambush cost', () => {
                expect(card.isAmbush()).toBe(true);
                expect(card.getAmbushCost()).toBe(2);
            });
        });
    });
});
