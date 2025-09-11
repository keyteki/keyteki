describe('Cleaner', function () {
    describe("Cleaner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'cleaner',
                    inPlay: ['cleaner:toad', 'flaxia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });

            this.cleaner1 = this.player1.player.creaturesInPlay[0];
        });

        it('should deal 3 damage on action', function () {
            this.player1.useAction(this.cleaner1);
            expect(this.player1).toBeAbleToSelect(this.cleaner1);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
