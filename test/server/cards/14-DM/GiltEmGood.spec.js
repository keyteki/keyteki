describe('Gilt Em Good', function () {
    describe("Gilt Em Good's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['gilt--em-good'],
                    inPlay: ['bosun-creen', 'troll', 'flip-stallard']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('each friendly flank creature captures 1 when no yellow key is forged', function () {
            this.player1.play(this.giltEmGood);
            expect(this.bosunCreen.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.flipStallard.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the capture when player has forged yellow key', function () {
            this.player1.player.keys = { red: false, blue: false, yellow: true };
            this.player1.play(this.giltEmGood);
            expect(this.bosunCreen.amber).toBe(2);
            expect(this.troll.amber).toBe(0);
            expect(this.flipStallard.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the capture when opponent has forged yellow key', function () {
            this.player2.player.keys = { red: false, blue: false, yellow: true };
            this.player1.play(this.giltEmGood);
            expect(this.bosunCreen.amber).toBe(2);
            expect(this.flipStallard.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
