describe('Ooni Lars', function () {
    describe("Ooni-Lars's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 3,
                    inPlay: ['oŏni-lars']
                },
                player2: {}
            });
        });

        it("pays opponent 1 and increases opponent's key cost by 4 next turn", function () {
            this.player1.reap(this.oŏniLars);
            this.player1.clickCard(this.oŏniLars);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(10);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing extra when player declines', function () {
            this.player1.reap(this.oŏniLars);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
