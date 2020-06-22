describe('Sacro-Fiend', function () {
    describe("Sacro-Fiend's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['sacro-bot'],
                    hand: ['sacro-saurus']
                },
                player2: {
                    inPlay: ['troll', 'dodger']
                }
            });
        });

        it('should discard a card from hand and draw a card', function () {
            this.player1.reap(this.sacroBot);

            this.player1.clickCard(this.sacroSaurus);

            expect(this.player1.hand.length).toBe(1);
            expect(this.sacroSaurus.location).toBe('discard');
        });

        it('should not draw a card if hand is empty', function () {
            this.player1.moveCard(this.sacroSaurus, 'archives');

            this.player1.reap(this.sacroBot);

            expect(this.player1.hand.length).toBe(0);
        });
    });
});
