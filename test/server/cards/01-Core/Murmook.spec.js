describe('Murmook', function () {
    describe("Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['murmook']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should increase opponent key cost by 1', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player2.clickPrompt('Untamed');
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
