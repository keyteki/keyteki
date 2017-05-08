/*global describe, it, beforeEach, expect, spyOn*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    describe('the useStealthToBypass() function', function() {
        function createCard() {
            let card = new DrawCard({}, {});
            spyOn(card, 'canBeBypassedByStealth').and.returnValue(true);
            return card;
        }

        describe('when the card does not have stealth', function() {
            beforeEach(function() {
                this.source = createCard();
                this.target = createCard();
            });

            it('should return false.', function() {
                expect(this.source.useStealthToBypass(this.target)).toBe(false);
            });
        });

        describe('when the card has stealth and the target does not', function() {
            beforeEach(function() {
                this.source = createCard();
                this.source.addKeyword('Stealth');
                this.target = createCard();
            });

            it('should return true.', function() {
                expect(this.source.useStealthToBypass(this.target)).toBe(true);
            });

            it('should mark the target card as being bypassed', function() {
                this.source.useStealthToBypass(this.target);
                expect(this.target.stealth).toBe(true);
            });

            it('should set the stealth target on the source card', function() {
                this.source.useStealthToBypass(this.target);
                expect(this.source.stealthTarget).toBe(this.target);
            });
        });

        describe('when the target cannot be bypassed', function() {
            beforeEach(function() {
                this.source = createCard();
                this.source.addKeyword('Stealth');
                this.target = createCard();
                this.target.canBeBypassedByStealth.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.source.useStealthToBypass(this.target)).toBe(false);
            });

            it('should not mark the target card as being bypassed', function() {
                this.source.useStealthToBypass(this.target);
                expect(this.target.stealth).toBeFalsy();
            });

            it('should not set the stealth target on the source card', function() {
                this.source.useStealthToBypass(this.target);
                expect(this.source.stealthTarget).toBeUndefined();
            });
        });
    });
});
