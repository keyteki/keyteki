describe('Tyrannus Aquilae', function () {
    describe("Tyrannus Aquilae's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['tyrannus-aquilae']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });

            this.tyrannusAquilae.amber = 1;
        });

        it('should capture 1 at end of each turn', function () {
            this.player1.endTurn();
            expect(this.tyrannusAquilae.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.tyrannusAquilae.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player1.clickPrompt('brobnar');
        });

        it('should move 1 amber to your pool on fight', function () {
            this.player1.fightWith(this.tyrannusAquilae, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.tyrannusAquilae.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
