describe('Veemos Lightbringer', function () {
    describe("Veemos Lightbringer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['veemos-lightbringer'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['dominator-bauble', 'troll', 'tolas']
                }
            });
        });

        it('should destroy all elusive creatures on play', function () {
            this.player1.playCreature(this.veemosLightbringer);
            expect(this.veemosLightbringer.location).toBe('play area');
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.tolas.location).toBe('discard');
            expect(this.dominatorBauble.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if no elusive creatures exist', function () {
            this.player1.moveCard(this.urchin, 'discard');
            this.player1.moveCard(this.tolas, 'discard');
            this.player1.playCreature(this.veemosLightbringer);
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
