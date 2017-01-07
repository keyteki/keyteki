/*global describe, it, beforeEach, expect, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent']);
        this.card = new DrawCard({ game: this.gameSpy }, this.testCard);
    });

    describe('modifyPower()', function() {
        describe('when called with a positive power', function() {
            it('should increase the power on the card and raise a onCardPowerChanged event', function() {
                this.card.modifyPower(2);

                expect(this.card.power).toBe(2);
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardPowerChanged', this.card, 2);
            });
        });

        describe('when called with a negative power', function() {
            it('should reduce the power on the card and raise a onCardPowerChanged event', function() {
                this.card.power = 2;
                this.card.modifyPower(-2);

                expect(this.card.power).toBe(0);
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardPowerChanged', this.card, -2);
            });
        });

        describe('when a card power would go negative', function() {
            it('should set the power of the card to 0', function() {
                this.card.power = 2;
                this.card.modifyPower(-5);

                expect(this.card.power).toBe(0);
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardPowerChanged', this.card, -2);
            });
        });
    });
});
