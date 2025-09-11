describe('Forbidden Tome', function () {
    describe("Forbidden Tome's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['mass-buyout'],
                    inPlay: ['forbidden-tome'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    hand: ['stealth-mode'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('does not affect non-haunted players', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            expect(this.player2.player.hand.length).toBe(6);
        });

        it('affects self when haunted', function () {
            this.player1.play(this.massBuyout);
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(7);
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            expect(this.player2.player.hand.length).toBe(6);
        });

        it('affects opponent when haunted', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.stealthMode);
            this.player2.endTurn();
            expect(this.player2.player.hand.length).toBe(7);
        });
    });
});
