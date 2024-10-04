describe('Ven Omawk', function () {
    describe("Ven Omawk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum'
                },
                player2: {
                    inPlay: ['ven-omawk']
                }
            });
        });

        it('should stack', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(5);
        });
    });
});
