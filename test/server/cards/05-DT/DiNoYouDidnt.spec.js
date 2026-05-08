describe("Di-No You Didn't!", function () {
    describe("Di-No You Didn't!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['di-no-you-didn-t'],
                    inPlay: ['senator-shrix', 'chronus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mindwarper', 'zorg', 'krump']
                }
            });

            this.chronus.amber = 1;
            this.krump.amber = 1;
            this.zorg.amber = 3;
        });

        it('should destroy an enemy creature with amber on it', function () {
            this.player1.play(this.diNoYouDidnT);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.chronus);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
        });
    });
});
