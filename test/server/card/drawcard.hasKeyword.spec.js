/*global describe, it, beforeEach, expect*/

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', () => {
    var owner = {};
    var card;

    describe('the hasKeyword() function', () => {
        describe('when the card mentions a keyword in its body', () => {
            beforeEach(() => {
                card = new DrawCard(owner, { text: 'Each <i>Ranger</i> character you control cannot be bypassed by stealth.\n<b>Interrupt:</b> When Benjen Stark is killed, gain 2 power for your faction. Then, shuffle him back into your deck instead of placing him in your dead pile."' });
            });

            it('should return false.', () => {
                expect(card.hasKeyword('Stealth')).toBe(false);
            });
        });

        describe('when the card has a keyword line', () => {
            beforeEach(() => {
                card = new DrawCard(owner, { text: 'Intimidate. Renown. Notarealkeyword.\nRobert Baratheon gets +1 STR for each other kneeling character in play.' });
            });

            it('should return true for each keyword', () => {
                expect(card.hasKeyword('Intimidate')).toBe(true);
                expect(card.hasKeyword('Renown')).toBe(true);
            });

            it('should not be case sensitive', () => {
                expect(card.hasKeyword('InTiMiDaTe')).toBe(true);
            });

            it('should reject non-valid keywords', () => {
                expect(card.hasKeyword('Notarealkeyword')).toBe(false);
            });
        });
    });
});
