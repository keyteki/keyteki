describe('Phantasm', function () {
    describe("Phantasm's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'phantasm',
                    hand: ['a-strong-feeling', 'touchstone'],
                    inPlay: ['phantasm:toad']
                },
                player2: {
                    amber: 1,
                    hand: ['helper-bot']
                }
            });

            this.phantasm = this.player1.player.creaturesInPlay[0];
        });

        it('should discard a card from hand on reap', function () {
            this.player1.reap(this.phantasm);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.touchstone);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.touchstone);
            expect(this.touchstone.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
