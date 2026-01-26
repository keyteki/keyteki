describe('Epic Poem', function () {
    describe("Epic Poem's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['bubbles', 'epic-poem', 'axiom-of-grisk'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should exalt and gain amber', function () {
            expect(this.player1.amber).toBe(1);

            this.flaxia.addToken('amber', 2);
            expect(this.flaxia.amber).toBe(2);

            this.player1.play(this.epicPoem);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.flaxia);

            this.player1.clickCard(this.flaxia);

            expect(this.flaxia.amber).toBe(3);
            expect(this.player1.amber).toBe(4);
        });

        it('should have no effect with no friendly creatures', function () {
            expect(this.player1.amber).toBe(1);

            this.player1.play(this.axiomOfGrisk);
            this.player1.clickCard(this.gub);
            expect(this.player1.player.creaturesInPlay.length).toBe(0);

            this.player1.play(this.epicPoem);

            expect(this.player1.amber).toBe(1);
        });
    });
});
