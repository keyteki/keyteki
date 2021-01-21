describe('PI Sweven Eveil Twin', function () {
    describe('PI Sweven Eveil Twin', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['pi-sweven-evil-twin']
                },
                player2: {
                    amber: 2,
                    hand: ['murkens', 'murkens', 'murkens', 'murkens', 'murkens', 'murkens']
                }
            });
        });

        it("when the tide is neutral, should not discard a card from opponent's hand", function () {
            this.player1.reap(this.piSwevenEvilTwin);
            expect(this.player2.player.hand.length).toBe(6);
        });

        it("when the tide is low, should not discard a card from opponent's hand", function () {
            this.player1.lowerTide();
            this.player1.reap(this.piSwevenEvilTwin);
            expect(this.player2.player.hand.length).toBe(6);
        });

        it("when the tide is high, should discard a card from opponent's hand", function () {
            this.player1.raiseTide();
            this.player1.reap(this.piSwevenEvilTwin);
            expect(this.player2.player.hand.length).toBe(5);
        });
    });
});
