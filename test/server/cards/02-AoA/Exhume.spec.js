describe('Exhume', function () {
    describe("Exhume's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['flaxia'],
                    hand: ['exhume'],
                    discard: ['glimmer', 'ancient-bear', 'bumblebird', 'shooler'],
                    amber: 4
                },
                player2: {
                    amber: 8,
                    inPlay: ['bumpsy'],
                    discard: ['troll']
                }
            });
        });

        it('should allow selecting non-alpha creatures', function () {
            this.player1.play(this.exhume);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            this.player1.clickPrompt('Left');
            expect(this.shooler.location).toBe('play area');
        });
    });
});
