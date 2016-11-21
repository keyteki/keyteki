/*global describe, it, beforeEach, expect, spyOn*/

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', () => {
    var cardDataWithStealth = { text: 'Stealth.' };
    var cardDataWithoutStealth = { text: '' };
    var source;
    var target;

    describe('the useStealthToBypass() function', () => {
        describe('when the card does not have stealth', () => {
            beforeEach(() => {
                source = new DrawCard({}, cardDataWithoutStealth);
                target = new DrawCard({}, cardDataWithoutStealth);
            });

            it('should return false.', () => {
                expect(source.useStealthToBypass(target)).toBe(false);
            });
        });

        describe('when the card has stealth and the target does not', () => {
            beforeEach(() => {
                source = new DrawCard({}, cardDataWithStealth);
                target = new DrawCard({}, cardDataWithoutStealth);
            });

            it('should return true.', () => {
                expect(source.useStealthToBypass(target)).toBe(true);
            });

            it('should mark the target card as being bypassed', () => {
                source.useStealthToBypass(target);
                expect(target.stealth).toBe(true);
            });

            it('should set the stealth target on the source card', () => {
                source.useStealthToBypass(target);
                expect(source.stealthTarget).toBe(target);
            });
        });

        describe('when both cards have stealth', () => {
            beforeEach(() => {
                source = new DrawCard({}, cardDataWithStealth);
                target = new DrawCard({}, cardDataWithStealth);
            });

            it('should return false', () => {
                expect(source.useStealthToBypass(target)).toBe(false);
            });

            it('should not mark the target card as being bypassed', () => {
                source.useStealthToBypass(target);
                expect(target.stealth).toBeFalsy();
            });

            it('should not set the stealth target on the source card', () => {
                source.useStealthToBypass(target);
                expect(source.stealthTarget).toBeUndefined();
            });
        });
    });
});
