describe('Slipshot', function () {
    describe("Slipshot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    hand: ['slipshot'],
                    inPlay: ['seeker-needle', 'dust-pixie', 'lamindra']
                },
                player2: {
                    amber: 1
                }
            });

            this.stooge1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.playCreature(this.slipshot);
            this.player1.clickPrompt('Right');
            expect(this.stooge1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should ready when a neighbor is destroyed', function () {
            this.player1.playCreature(this.slipshot);
            this.player1.clickPrompt('Right');
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.stooge1);
            expect(this.stooge1.location).toBe('discard');
            expect(this.slipshot.exhausted).toBe(false);
            this.player1.reap(this.slipshot);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not ready when a non-neighbor is destroyed', function () {
            this.player1.playCreature(this.slipshot);
            this.player1.clickPrompt('Right');
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.dustPixie);
            expect(this.slipshot.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
