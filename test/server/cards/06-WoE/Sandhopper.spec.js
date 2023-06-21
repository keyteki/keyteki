describe('Sandhopper', function () {
    describe("Sandhopper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer', 'umbra', 'sandhopper'],
                    hand: ['pelf', 'vow-of-blood', 'conductor-jărroyă']
                }
            });
        });

        it('put a creature into your hand and play a non-ekwidon creature', function () {
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.vowOfBlood);
            expect(this.player1).not.toBeAbleToSelect(this.conductorJărroyă);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Left');
            expect(this.pelf.location).toBe('play area');
        });

        it('should fizzle with no creatures in play', function () {
            this.antiquitiesDealer.location = 'discard';
            this.umbra.location = 'discard';
            this.player1.useAction(this.sandhopper);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fizzle with a warded creature', function () {
            this.antiquitiesDealer.tokens.ward = 1;
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.antiquitiesDealer.tokens.ward).toBe(undefined);
        });

        it('should fizzle the second half if no non-ekwidon creatures in hand', function () {
            this.pelf.location = 'discard';
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('hand');
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.vowOfBlood);
            expect(this.player1).not.toBeAbleToSelect(this.conductorJărroyă);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
