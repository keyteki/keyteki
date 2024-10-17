describe('Effervescent Principle', function () {
    describe("Effervescent Principle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 0,
                    hand: ['effervescent-principle']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should halve both players amber', function () {
            this.player1.play(this.effervescentPrinciple);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.chains).toBe(1);
        });

        it('should halve both players amber', function () {
            this.player1.amber = 1;
            this.player2.amber = 4;
            this.player1.play(this.effervescentPrinciple);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.chains).toBe(1);
        });

        it('should halve both players amber', function () {
            this.player1.amber = 0;
            this.player2.amber = 7;
            this.player1.play(this.effervescentPrinciple);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.chains).toBe(1);
        });
    });
});
