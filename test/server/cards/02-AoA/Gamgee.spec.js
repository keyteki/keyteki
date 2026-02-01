describe('Gamgee', function () {
    describe("Gamgee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    inPlay: ['gamgee']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should steal 1 amber if opponent has more amber on reap', function () {
            this.player1.reap(this.gamgee);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal amber if player has equal or more amber', function () {
            this.player1.amber = 5;
            this.player1.reap(this.gamgee);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
