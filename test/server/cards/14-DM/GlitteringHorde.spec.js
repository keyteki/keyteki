describe('Glittering Horde', function () {
    describe("Glittering Horde's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['glittering-horde']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('steals 1 per color of forged keys', function () {
            this.player1.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player2.player.keys.yellow = true;
            this.player1.play(this.glitteringHorde);
            // 3 unique colors stolen + 1 bonus pip
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts each color only once', function () {
            this.player1.player.keys.red = true;
            this.player2.player.keys.red = true;
            this.player1.play(this.glitteringHorde);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 0 with no forged keys', function () {
            this.player1.play(this.glitteringHorde);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
