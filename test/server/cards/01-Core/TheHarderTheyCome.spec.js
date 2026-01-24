describe('The Harder They Come', function () {
    describe("The Harder They Come's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['commander-remiel', 'francus'],
                    hand: ['the-harder-they-come']
                },
                player2: {
                    inPlay: ['lamindra', 'ancient-bear']
                }
            });
        });

        it('should purge a creature with power 5 or higher', function () {
            this.player1.play(this.theHarderTheyCome);
            expect(this.player1).toHavePrompt('The Harder They Come');
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.francus);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
