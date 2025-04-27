describe('Help From Another Self', function () {
    describe("Help From Another Self's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['help-from-another-self'],
                    deck: ['omega-tt'],
                    discard: ['omega-tt', 'troll']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should search for a Variant creature and put it into hand', function () {
            this.player1.play(this.helpFromAnotherSelf);
            expect(this.player1).toBeAbleToSelect(this.omegaTt);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.omegaTt);
            this.player1.clickPrompt('Done');
            expect(this.omegaTt.location).toBe('hand');
        });
    });
});
