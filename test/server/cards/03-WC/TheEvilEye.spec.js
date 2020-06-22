describe('The Evil Eye', function () {
    describe("The Evil Eye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    hand: ['the-evil-eye']
                },
                player2: {
                    amber: 6
                }
            });
        });
        it('should stop a key being forged', function () {
            this.player1.play(this.theEvilEye);
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(6);
        });
    });
});
