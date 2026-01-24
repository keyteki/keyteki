describe('Braindart', function () {
    describe("Braindart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    hand: ['braindart'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow enraging an enemy creature, it will capture 1A from its own side', function () {
            this.player1.play(this.braindart);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            expect(this.gub.enraged).toBe(true);
            expect(this.gub.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
