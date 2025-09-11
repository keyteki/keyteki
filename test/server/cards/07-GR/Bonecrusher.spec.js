describe('Bonecrusher', function () {
    describe("Bonecrusher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['bonecrusher'],
                    inPlay: ['foozle', 'cpo-zytar'],
                    discard: ['groke']
                },
                player2: {
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('gives parent an action to destroy a creature', function () {
            this.player1.playUpgrade(this.bonecrusher, this.foozle);
            this.player1.useAction(this.foozle);
            expect(this.player1).toBeAbleToSelect(this.foozle);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.foozle.location).toBe('play area');
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
