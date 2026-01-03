describe('Big Sal', function () {
    describe("Big Sal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    hand: ['big-sal']
                },
                player2: {
                    amber: 1
                }
            });

            this.stooge1 = this.player1.player.deck[0];
            this.stooge2 = this.player1.player.deck[1];
        });

        it('should make 2 tokens on play', function () {
            this.player1.playCreature(this.bigSal);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.stooge1.location).toBe('play area');
            expect(this.stooge2.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
