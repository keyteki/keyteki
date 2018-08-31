describe('Phase Shift', function() {
    integration(function() {
        describe('Phase Shift\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        hand: ['phase-shift', 'virtuous-works', 'wild-wormhole', 'punch']
                    },
                    player2: {
                        inPlay: ['batdrone']
                    }
                });
                this.player1.play(this.phaseShift);
            });

            it('should allow playing a non-logos card', function() {
                expect(this.player1.amber).toBe(0);
                this.player1.clickCard(this.virtuousWorks);
                this.player1.clickPrompt('Play this action');
                expect(this.player1.amber).toBe(3);
                this.player1.clickCard(this.punch);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should stack', function() {
                this.player1.moveCard(this.phaseShift, 'hand');
                this.player1.play(this.phaseShift);
                expect(this.player1.amber).toBe(0);
                this.player1.clickCard(this.virtuousWorks);
                this.player1.clickPrompt('Play this action');
                expect(this.player1.amber).toBe(3);
                this.player1.play(this.punch);
                expect(this.player1).toHavePrompt('Punch');
            });

            it('should not carry over to the following turn', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
                this.player1.clickCard(this.virtuousWorks);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(0);
            });

            it('should not be used up by Wild Wormhole', function() {
                this.player1.moveCard(this.virtuousWorks, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
                this.player1.play(this.punch);
                expect(this.player1).toHavePrompt('Punch');
            });
        });
    });
});
