describe('Nepenthe Seed', function () {
    describe("Nepenthe Seed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['nepenthe-seed'],
                    discard: ['dust-pixie', 'way-of-the-bear']
                },
                player2: {
                    discard: ['lamindra', 'batdrone']
                }
            });
        });

        it('should sacrifice itself and return a card from discard to hand', function () {
            this.player1.clickCard(this.nepentheSeed);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Nepenthe Seed');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.wayOfTheBear);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.dustPixie);
            expect(this.nepentheSeed.location).toBe('discard');
            expect(this.dustPixie.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
