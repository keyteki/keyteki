describe('Hypothesize', function () {
    describe("Hypothesize's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'alpha-gamma',
                    inPlay: ['library-of-babble', 'gub'],
                    hand: ['hypothesize', 'static-charge'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['dr-milli'],
                    hand: ['reckless-experimentation']
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
            this.player1.chains = 36;
        });

        it('should make a token creature but not archive without enough Logos', function () {
            this.player1.play(this.hypothesize);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.hypothesize.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token creature and archive with 3 Logos cards (the token counts)', function () {
            this.player1.playUpgrade(this.staticCharge, this.drMilli);
            this.player1.play(this.hypothesize);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.hypothesize.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token creature and not archive with an opponent Logos upgrade', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playUpgrade(this.recklessExperimentation, this.gub);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.hypothesize);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.hypothesize.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
