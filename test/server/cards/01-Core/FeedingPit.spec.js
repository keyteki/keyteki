describe('Feeding Pit', function () {
    describe("Feeding Pit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['feeding-pit'],
                    hand: ['ember-imp']
                },
                player2: {}
            });
        });

        it('should discard a creature from hand and gain 1 amber', function () {
            this.player1.useAction(this.feedingPit);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Feeding Pit's ability with no creatures in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['feeding-pit'],
                    hand: ['fear']
                },
                player2: {}
            });
        });

        it('should not be able to use when there are no creatures in hand', function () {
            this.player1.useAction(this.feedingPit);
            expect(this.fear.location).toBe('hand');
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
