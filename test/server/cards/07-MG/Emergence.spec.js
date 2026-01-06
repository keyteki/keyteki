describe('Emergence', function () {
    describe("Emergence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'emergence',
                        'crushing-tentacle',
                        'ancient-bear',
                        'grappling-tentacle',
                        'shield-tentacle'
                    ],
                    inPlay: ['legendary-keyraken']
                },
                player2: {}
            });

            this.player1.moveCard(this.crushingTentacle, 'deck');
            this.player1.moveCard(this.ancientBear, 'deck');
            this.player1.moveCard(this.grapplingTentacle, 'deck');
            this.player1.moveCard(this.shieldTentacle, 'discard');
        });

        it('searches deck for a keyraken creature and plays it', function () {
            this.player1.play(this.emergence);
            expect(this.player1).toHavePrompt('Emergence');
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.shieldTentacle);
            this.player1.clickCard(this.crushingTentacle);
            this.player1.clickPrompt('Right');
            expect(this.crushingTentacle.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('searches discard for a keyraken creature and plays it', function () {
            this.player1.play(this.emergence);
            expect(this.player1).toHavePrompt('Emergence');
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.shieldTentacle);
            this.player1.clickCard(this.shieldTentacle);
            this.player1.clickPrompt('Right');
            expect(this.shieldTentacle.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
