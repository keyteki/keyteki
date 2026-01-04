describe('Perfect Harmony', function () {
    describe("Perfect Harmony's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'blypyp'],
                    hand: ['perfect-harmony', 'revered-monk', 'bring-low']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should draw 2 cards, gain 2 amber, and archive a card when controlling 3+ different houses', function () {
            this.player1.playCreature(this.reveredMonk);
            const handSize = this.player1.hand.length;
            this.player1.play(this.perfectHarmony);

            // Should archive a card from hand
            expect(this.player1).toBeAbleToSelect(this.bringLow);
            expect(this.player1).not.toBeAbleToSelect(this.reveredMonk);
            this.player1.clickCard(this.bringLow);

            // Should draw 2 cards
            expect(this.player1.hand.length).toBe(handSize); // -1 for Perfect Harmony + 2 drawn - 1 archives = +0
            // Should gain 2 amber
            expect(this.player1.amber).toBe(3);
            expect(this.bringLow.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not trigger when controlling less than 3 different houses', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.perfectHarmony);
            // Should not draw cards or gain amber
            expect(this.player1.hand.length).toBe(handSize - 1); // Only -1 for Perfect Harmony
            expect(this.player1.amber).toBe(1);
            // Should not archive a card
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
