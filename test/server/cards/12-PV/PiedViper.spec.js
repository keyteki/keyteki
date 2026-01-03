describe('Pied Viper', function () {
    describe("Pied Viper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['pied-viper'],
                    hand: ['searine']
                },
                player2: {
                    inPlay: ['ancient-bear', 'ember-imp']
                }
            });
        });

        it('should gain control of a creature when it reaps and there are more enemy creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            this.player2.clickPrompt('Left');
            expect(this.ancientBear.controller).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player2);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.ancientBear.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.controller).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not gain control when there are not more enemy creatures', function () {
            this.player1.play(this.searine);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            expect(this.ancientBear.controller).toBe(this.player2.player);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
