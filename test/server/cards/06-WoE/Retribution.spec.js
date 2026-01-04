describe('Retribution', function () {
    describe("Retribution's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['retribution', 'holdfast'],
                    inPlay: ['umbra']
                },
                player2: {
                    inPlay: ['gub', 'troll']
                }
            });
        });

        it('should allow destroying an enemy creature when opponent has more creatures', function () {
            this.player1.play(this.retribution);
            expect(this.player1).toHavePrompt('Retribution');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
        });

        it('should do nothing when opponent does not have more creatures', function () {
            this.player1.play(this.holdfast);
            this.player1.play(this.retribution);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
