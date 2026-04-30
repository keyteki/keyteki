describe('Waspscream', function () {
    describe("Waspscream's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['waspscream']
                },
                player2: {
                    inPlay: ['snufflegator', 'urchin']
                }
            });
        });

        it('takes control of an enemy creature at start of turn when exhausted', function () {
            this.waspscream.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done'); // entrench prompt
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.controller).toBe(this.player1.player);
            this.player1.clickPrompt('ekwidon');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when ready', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
            this.player1.clickPrompt('ekwidon');
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
