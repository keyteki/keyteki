/*global describe, it, beforeEach, expect*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    describe('the useStealthToBypass() function', function() {
        describe('when the card does not have stealth', function() {
            beforeEach(function() {
                this.source = new DrawCard({}, {});
                this.target = new DrawCard({}, {});
            });

            it('should return false.', function() {
                expect(this.source.useStealthToBypass(this.target)).toBe(false);
            });
        });

        describe('when the card has stealth and the target does not', function() {
            beforeEach(function() {
                this.source = new DrawCard({}, {});
                this.source.addKeyword('Stealth');
                this.target = new DrawCard({}, {});
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

        describe('when both cards have stealth', function() {
            beforeEach(function() {
                this.source = new DrawCard({}, {});
                this.source.addKeyword('Stealth');
                this.target = new DrawCard({}, {});
                this.target.addKeyword('Stealth');
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
