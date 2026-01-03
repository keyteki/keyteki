describe('Rufus Vergilius', function () {
    describe("Rufus Vergilius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['hunting-witch', 'rufus-vergilius', 'urchin', 'umbra']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should capture 1 amber and ward a neighboring creature after reap', function () {
            this.player1.reap(this.rufusVergilius);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.tokens.amber).toBe(1);
            expect(this.urchin.warded).toBe(true);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
