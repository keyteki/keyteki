describe('Curse of Forgery', function () {
    describe("Curse of Forgery's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 20,
                    house: 'skyborn',
                    hand: ['curse-of-forgery', 'freedom-to-be']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should prevent key forging and purge itself when opponent tries to forge', function () {
            this.player1.play(this.curseOfForgery);
            // Due to Treachery, the card should be under player2's control
            expect(this.curseOfForgery.controller).toBe(this.player2.player);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.curseOfForgery.location).toBe('purged');
            expect(this.player2.amber).toBe(6); // No amber spent
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent key forging for the controller', function () {
            this.player1.play(this.curseOfForgery);
            // Due to Treachery, the card should be under player2's control
            expect(this.curseOfForgery.controller).toBe(this.player2.player);
            this.player1.play(this.freedomToBe);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.curseOfForgery.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
