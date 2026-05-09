describe('Bordan the Redeemed', function () {
    describe("Bordan the Redeemed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bordan-the-redeemed']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should capture 2 amber on action', function () {
            this.player1.useAction(this.bordanTheRedeemed);
            expect(this.bordanTheRedeemed.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
