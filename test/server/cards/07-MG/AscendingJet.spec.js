describe('Ascending Jet', function () {
    describe("Ascending Jet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    inPlay: ['ascending-jet', 'legendary-keyraken']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('gives a friendly creature three +1 power counters on action', function () {
            this.player1.clickCard(this.ascendingJet);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Ascending Jet');
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.legendaryKeyraken);
            expect(this.legendaryKeyraken.tokens.power).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
