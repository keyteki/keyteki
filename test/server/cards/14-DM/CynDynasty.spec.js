describe('Cyn Dynasty', function () {
    describe("Cyn Dynasty's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['cyn-dynasty']
                },
                player2: {
                    amber: 6,
                    deck: ['troll', 'urchin', 'bumpsy', 'caspart', 'krump']
                }
            });
        });

        it('increases key cost by 2 for both players', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(8);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers after opponent forges; gain 2 draw 4 destroy', function () {
            this.player2.player.amber = 8;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            // Cyn Dynasty controlled by player1 - reaction triggers
            expect(this.player1.amber).toBe(2);
            expect(this.player1.hand.length).toBe(10);
            expect(this.cynDynasty.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
