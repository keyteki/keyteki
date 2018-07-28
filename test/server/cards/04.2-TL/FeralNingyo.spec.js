describe('Feral Ningyo', function () {
    integration(function () {
        describe('Feral Ningyo\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['feral-ningyo', 'cloud-the-mind', 'fine-katana']
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

                it('should cancel Feral Ningyo activating it\'s ability the first time', function () {
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.feral);
                    this.player1.clickPrompt('Put into play');
                    expect(this.feral.location).toBe('hand');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                // RRG v1.4: Cards in hidden game areas (e.g. in hand) have no card memory, so Limits do not apply to them.
                it('should not prevent Feral Ningyo from activating it\'s ability a second time', function () {
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.feral);
                    this.player1.clickPrompt('Put into play');
                    expect(this.feral.location).toBe('hand');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    this.player2.pass();
                    this.player1.clickCard(this.feral);
                    this.player1.clickPrompt('Put into play');
                    expect(this.feral.location).toBe('play area');
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

                it('should return to it the conflict deck at the end of the conflict even with a card attached', function () {
                    this.player1.clickPrompt('Put into play');
                    this.player2.pass();
                    this.katana = this.player1.playAttachment('fine-katana', this.feral);
                    expect(this.katana.parent).toBe(this.feral);
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
