describe('Feral Ningyo', function () {
    integration(function () {
        describe('Feral Ningyo\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['feral-ningyo', 'cloud-the-mind']
                    },
                    player2: {
                        inPlay: ['hida-kisada'],
                        hand: ['let-go']
                    }
                });
                this.feral = this.player1.findCardByName('feral-ningyo');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.cloud = this.player1.playAttachment('cloud-the-mind', this.kisada);
            });

            it('should not activate outside of conflicts', function () {
                this.player2.pass();
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

            describe('when Hida Kisada\'s ability is active', function () {
                beforeEach(function () {
                    this.player2.clickCard('let-go', 'hand');
                    this.player2.clickCard(this.cloud);
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'water',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                });

                it('should cancel Feral Ningyo being put into play', function () {
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.feral);
                    this.player1.clickPrompt('Put into play');
                    expect(this.feral.location).toBe('hand');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });
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
