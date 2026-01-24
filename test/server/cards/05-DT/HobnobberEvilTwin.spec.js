describe('Hobnobber Evil Twin', function () {
    describe("Hobnobber Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'untamed',
                    inPlay: ['hobnobber-evil-twin'],
                    hand: ['fertility-chant']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus'],
                    hand: ['ghostly-hand', 'nexus']
                }
            });
        });

        it('should not steal if opponent has more than 1 amber', function () {
            this.player1.useOmni(this.hobnobberEvilTwin);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
        });

        it('should steal 1A if opponent has exactly 1 amber', function () {
            this.player2.amber = 1;
            this.player1.useOmni(this.hobnobberEvilTwin);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });
    });
});
