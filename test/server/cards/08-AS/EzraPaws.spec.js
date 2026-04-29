describe('Ezra Paws', function () {
    describe("Ezra Paws's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['ezra-paws']
                },
                player2: {
                    hand: ['anger', 'pelf']
                }
            });
        });

        it('should reveal opponent hand and draw a card on play', function () {
            this.player1.playCreature(this.ezraPaws);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Ezra Paws to reveal Anger and Pelf',
                2
            );
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should reveal opponent hand and draw a card on reap', function () {
            this.player1.playCreature(this.ezraPaws);
            this.ezraPaws.ready();
            this.player1.reap(this.ezraPaws);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Ezra Paws to reveal Anger and Pelf',
                2
            );
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
