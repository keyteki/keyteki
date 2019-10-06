describe('DataForge', function() {
    integration(function() {
        describe('DataForge\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        hand: ['data-forge', 'phase-shift', 'virtuous-works', 'chuff-ape', 'dextre', 'batdrone'],
                        inPlay: ['sequis', 'mindwarper', 'blypyp']
                    },
                    player2: {
                        inPlay: ['zorg']
                    }
                });
            });

            it('should not prompt to forge when the player has insufficient amber', function() {
                this.player1.play(this.dataForge);
                expect(this.player1.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should prompt to forge a key if the player has enough amber', function() {
                this.player1.amber = 10;
                this.player1.play(this.dataForge);
                expect(this.player1).toHavePrompt('Do you wish to forge a key?');
                this.player1.clickPrompt('Yes');
                expect(this.player1.amber).toBe(0);
                expect(this.player1.player.keys).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
