describe('Binate Rupture', function () {
    describe("Binate Rupture's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['binate-rupture'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 2,
                    hand: [],
                    inPlay: ['bad-penny', 'helper-bot', 'mother', 'troll']
                }
            });
        });

        it("should double both player's amber", function () {
            this.player1.play(this.binateRupture);

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
        });
    });
});
