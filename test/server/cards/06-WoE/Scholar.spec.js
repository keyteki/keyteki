describe('Scholar', function () {
    describe("Scholar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'scholar',
                    amber: 1,
                    inPlay: ['scholar'],
                    hand: ['helper-bot', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should draw a card after reap', function () {
            expect(this.player1.hand.length).toBe(2);
            this.player1.reap(this.scholar);
            expect(this.player1.hand.length).toBe(3);
        });
    });
});
