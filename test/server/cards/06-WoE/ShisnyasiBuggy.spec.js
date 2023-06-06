describe('ShiSnyasiBuggy', function () {
    describe("ShiSnyasiBuggy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles'],
                    inPlay: ['shĭsnyasĭ-buggy']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('if there is no amber, do not draw 3 cards', function () {
            this.player1.amber = 0;
            this.player1.useAction(this.shĭsnyasĭBuggy);
            expect(this.player1.player.hand.length).toBe(6);
        });

        it('if 1A is lost, draw 3 cards', function () {
            this.player1.useAction(this.shĭsnyasĭBuggy);
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.hand.length).toBe(9);
        });
    });
});
