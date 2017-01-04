/*global describe, it, beforeEach, expect*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.card = new DrawCard({}, this.testCard);
    });

    describe('getSummary', function() {
        describe('strength property', function() {
            describe('when the card has non-zero strength', function() {
                beforeEach(function() {
                    this.testCard.strength = 5;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the strength', function() {
                    expect(this.summary.strength).toBe(5);
                });
            });

            describe('when the card has a zero strength', function() {
                beforeEach(function() {
                    this.testCard.strength = 0;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the strength', function() {
                    expect(this.summary.strength).toBe(0);
                });
            });
        });
    });
});
