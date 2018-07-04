describe('Feral Ningyo', function () {
    integration(function () {
        describe('Feral Ningyo\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['feral-ningyo']
                    }
                });
                this.feral = this.player1.findCardByName('feral-ningyo');
            });

            it('should not activate outside of conflicts', function () {
                this.player1.clickCard(this.feral);
                expect(this.player1).not.toHavePromptButton('Put into play');
            });

            it('should not activate during non-water conflicts', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.feral);
                expect(this.player1).not.toHavePromptButton('Put into play');
            });

            describe('during a water conflict', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'water',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.feral);
                });

                it('should put it into play', function () {
                    this.player1.clickPrompt('Put into play');
                    expect(this.feral.location).toBe('play area');
                });

                it('should return to it the conflict deck at the end of the conflict', function () {
                    this.player1.clickPrompt('Put into play');
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t resolve');
                    expect(this.feral.location).toBe('conflict deck');
                });

                it('should shuffle when it is returned to the deck', function () {
                    this.player1.clickPrompt('Put into play');
                    this.noMoreActions();
                    spyOn(this.game, 'emitEvent');
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t resolve');
                    expect(this.game.emitEvent).toHaveBeenCalledWith('onDeckShuffled', jasmine.anything());
                });
            });
        });
    });
});
