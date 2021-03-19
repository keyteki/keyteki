describe('Saurian Deny', function () {
    describe("Saurian Denyy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['saurian-deny'],
                    inPlay: ['senator-shrix', 'chronus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mindwarper', 'zorg', 'krump']
                }
            });

            this.chronus.tokens.amber = 1;
            this.krump.tokens.amber = 1;
            this.zorg.tokens.amber = 3;
        });

        it('should destroy an enemy creature with amber on it', function () {
            this.player1.play(this.saurianDeny);
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
