describe('Hugger Mugger', function () {
    describe("Hugger Mugger's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['flaxia'],
                    hand: ['hugger-mugger']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('Capture 1 amber and steal 1 amber', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.play(this.huggerMugger);

            expect(this.huggerMugger.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it("Capture 1 amber and steal no amber because number of opponent's keys is not greater", function () {
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.play(this.huggerMugger);

            expect(this.huggerMugger.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
        });

        it('Capture 1 amber and steal no amber because opponent has only 1 amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.huggerMugger);

            expect(this.huggerMugger.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('Capture and steal no amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.huggerMugger);

            expect(this.huggerMugger.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });
    });
});
