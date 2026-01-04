describe('Prognosticating Witch', function () {
    describe("Prognosticating Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['prognosticating-witch', 'dew-faerie', 'umbra'],
                    discard: ['bad-penny', 'krump', 'troll']
                },
                player2: {
                    inPlay: ['snufflegator']
                }
            });
        });

        it('should draw 2 cards when played with fewer than 3 cards in hand', function () {
            this.player1.play(this.prognosticatingWitch);
            expect(this.player1.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should draw 2 cards when played with exactly 3 cards in hand', function () {
            this.player1.moveCard(this.badPenny, 'hand');
            this.player1.play(this.prognosticatingWitch);
            expect(this.player1.hand.length).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not draw cards when played with more than 3 cards in hand', function () {
            this.player1.moveCard(this.badPenny, 'hand');
            this.player1.moveCard(this.krump, 'hand');
            expect(this.player1.hand.length).toBe(5);
            this.player1.play(this.prognosticatingWitch);
            expect(this.player1.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should draw 2 cards when reaped with 3 or fewer cards in hand', function () {
            this.player1.play(this.prognosticatingWitch);
            this.player1.player.hand = [];
            this.prognosticatingWitch.exhausted = false;
            this.player1.reap(this.prognosticatingWitch);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
