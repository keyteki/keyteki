describe('Titan Sentry', function () {
    describe("Titan Sentry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['titan-sentry', 'gub', 'charette']
                },
                player2: {
                    hand: ['shadow-of-dis', 'draining-touch']
                }
            });
        });

        it('should cause a random card from own hand to be archived on play', function () {
            this.player1.play(this.titanSentry);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should cause a random card from opponent hand to be archived on play', function () {
            this.player1.play(this.titanSentry);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should cause a random card from own hand to be archived on reap', function () {
            this.player1.play(this.titanSentry);
            this.player1.clickPrompt('Mine');
            this.titanSentry.exhausted = false;
            this.player1.reap(this.titanSentry);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should prevent both players from taking archives', function () {
            this.player1.play(this.titanSentry);
            this.player1.clickPrompt("Opponent's");
            this.player1.moveCard(this.charette, 'archives');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.expectReadyToTakeAction(this.player2);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
