describe('Bastionclaw', function () {
    describe("Bastionclaw's ability", function () {
        it('reduces key cost by 1 per opponent forged key', function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['bastionclaw']
                },
                player2: {}
            });
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            this.player2.player.keys.red = true;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player1.player.getCurrentKeyCost()).toBe(5);
            this.player2.player.keys.blue = true;
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            expect(this.player1.player.getCurrentKeyCost()).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
