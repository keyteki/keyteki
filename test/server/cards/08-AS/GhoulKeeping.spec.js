describe('Ghoul-keeping', function () {
    describe("Ghoul-keeping's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['ghoul-keeping'],
                    inPlay: ['echofly', 'gub']
                },
                player2: {
                    inPlay: ['touchstone']
                }
            });
        });

        it('should ready a friendly geistoid creature ', function () {
            this.player1.reap(this.echofly);
            this.player1.play(this.ghoulKeeping);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.touchstone);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
