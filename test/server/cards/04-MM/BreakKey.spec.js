describe('Break-key', function () {
    describe("Break-key's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['break-key', 'urchin']
                },
                player2: {
                    amber: 4,
                    hand: ['snufflegator', 'full-moon', 'hunting-witch', 'flaxia', 'key-charge']
                }
            });
        });

        it("should not unforge opponent's key when equal amount of keys", function () {
            this.player1.play(this.breakKey);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it("should not unforge opponent's key whey controller has more keys", function () {
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player2.player.keys = { red: true, blue: false, yellow: false };

            this.player1.play(this.breakKey);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it("should unforge opponent's key and give them 6 amber", function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player2.player.keys = { red: true, blue: true, yellow: false };

            this.player1.play(this.breakKey);
            this.player1.clickPrompt('blue');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(10);
        });
    });
});
