describe('Digitallia', function () {
    describe("Digitallia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['flaxia', 'digitallia', 'helper-bot'],
                    hand: ['batdrone']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump']
                }
            });
        });

        it('should draw a card for each Logos neighbor when reaping', function () {
            this.player1.reap(this.digitallia);
            expect(this.player1.hand.length).toBe(2); // 1 from start + 1 from Logos neighbor
        });

        it('should draw 2 cards for each Logos neighbor when reaping', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.playCreature(this.batdrone, true);
            this.player1.reap(this.digitallia);
            expect(this.player1.hand.length).toBe(2); // 2 from Logos neighbors
        });

        it('should not draw cards when there are no Logos neighbors', function () {
            this.player1.moveCard(this.helperBot, 'deck');
            this.player1.reap(this.digitallia);
            expect(this.player1.hand.length).toBe(1); // Only the card from start
        });
    });
});
