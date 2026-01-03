describe('Brigadier Ols', function () {
    describe("Brigadier Ols's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['francus'],
                    inPlay: ['bull-wark', 'brigadier-ols', 'ember-imp']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('should get +2 armor for each Sanctum neighbor', function () {
            expect(this.brigadierOls.armor).toBe(2);
            expect(this.bullWark.armor).toBe(1);
            expect(this.emberImp.armor).toBe(0);
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.playCreature(this.francus);
            expect(this.brigadierOls.armor).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
