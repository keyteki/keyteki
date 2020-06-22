describe("Scientists' Bane", function () {
    describe("Scientists' Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['scientists--bane'],
                    inPlay: ['nogi-smartfist']
                },
                player2: {
                    amber: 4,
                    inPlay: ['old-boomy', 'dust-pixie']
                }
            });
        });
        it('prompt for a scientist creature to destroy', function () {
            this.player1.play(this.scientistsBane);
            expect(this.player1).toHavePrompt('Scientists’ Bane');
            expect(this.player1).toBeAbleToSelect(this.nogiSmartfist);
            expect(this.player1).toBeAbleToSelect(this.oldBoomy);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.nogiSmartfist);
            expect(this.nogiSmartfist.location).toBe('discard');
        });
    });
});
