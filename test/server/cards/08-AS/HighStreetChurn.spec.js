describe('High Street Churn', function () {
    describe("High Street Churn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['high-street-churn']
                },
                player2: {
                    hand: ['lamindra', 'umbra', 'dust-pixie', 'shooler']
                }
            });
        });

        it('should cause opponent to discard cards until a house is matched, and then refill hand', function () {
            this.player1.play(this.highStreetChurn);
            expect(this.player1).toHavePromptButton('shadows');
            expect(this.player1).toHavePromptButton('untamed');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).not.toHavePromptButton('logos');
            this.player1.clickPrompt('dis');
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).not.toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work when opponent has no cards of that house', function () {
            this.player2.moveCard(this.shooler, 'discard');
            this.player1.play(this.highStreetChurn);
            this.player1.clickPrompt('dis');
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work when opponent has no cards in hand', function () {
            this.player2.moveCard(this.shooler, 'discard');
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.dustPixie, 'discard');
            this.player2.moveCard(this.lamindra, 'discard');
            this.player1.play(this.highStreetChurn);
            this.player1.clickPrompt('dis');
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
