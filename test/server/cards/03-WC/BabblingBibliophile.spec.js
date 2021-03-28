describe('Babbling Bibliophile', function () {
    describe("BB's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['alaka', 'labwork'],
                    inPlay: ['babbling-bibliophile']
                },
                player2: {
                    inPlay: ['nexus']
                }
            });
        });

        it('should draw two cards when it reaps', function () {
            this.player1.reap(this.babblingBibliophile);
            expect(this.player1.hand.length).toBe(4);
            expect(this.player1.amber).toBe(1);
        });
    });
});
