describe('Sandhopper', function () {
    describe("Sandhopper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer', 'umbra', 'sandhopper'],
                    hand: ['pelf', 'vow-of-blood', 'conductor-jărroyă']
                },
                player2: {
                    hand: ['urchin']
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
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Left');
            expect(this.pelf.location).toBe('play area');
        });

        it('be optional to play a non-ekwidon creature', function () {
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Done');
            expect(this.antiquitiesDealer.location).toBe('hand');
            expect(this.pelf.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fizzle with no creatures in play', function () {
            this.antiquitiesDealer.location = 'discard';
            this.umbra.location = 'discard';
            this.player1.useAction(this.sandhopper);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fizzle with a warded creature', function () {
            this.antiquitiesDealer.ward();
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.antiquitiesDealer.warded).toBe(false);
        });

        it('should fizzle the second half if no non-ekwidon creatures in hand', function () {
            this.pelf.location = 'discard';
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('hand');
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.vowOfBlood);
            expect(this.player1).not.toBeAbleToSelect(this.conductorJărroyă);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
