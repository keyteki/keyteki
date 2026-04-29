describe('Cannon', function () {
    describe("Cannon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cannon']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });
        });

        it('should deal 2 damage to a target creature when used', function () {
            this.player1.useAction(this.cannon);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
