describe('Hobnobber', function () {
    describe("Hobnobber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    inPlay: ['hobnobber'],
                    hand: ['fertility-chant']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus'],
                    hand: ['ghostly-hand', 'nexus']
                }
            });
        });

        it('should not steal if opponent has less than 6 amber', function () {
            this.player1.useAction(this.hobnobber);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
        });

        it('should steal 2A if opponent has exactly 6 amber', function () {
            this.player2.amber = 6;
            this.player1.useAction(this.hobnobber);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });

        it('should steal 2A if opponent has more than 6 amber', function () {
            this.player2.amber = 8;
            this.player1.useAction(this.hobnobber);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(6);
        });
    });
});
