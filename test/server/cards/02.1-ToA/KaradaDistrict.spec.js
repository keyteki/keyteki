describe('Karada District', function() {
    integration(function() {
        describe('When Activating Karada District', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:3,
                        inPlay: ['adept-of-the-waves', 'seppun-guardsman'],
                        dynastyDeck: ['karada-district'],
                        hand: ['fine-katana', 'watch-commander', 'cloud-the-mind', 'favored-mount', 'born-in-war', 'oni-mask']
                    },
                    player2: {
                        fate:2,
                        inPlay: ['miya-mystic', 'fire-elemental-guard'],
                        dynastyDeck: ['karada-district']
                    }
                });
                this.karada1 = this.player1.placeCardInProvince('karada-district', 'province 1');
                this.karada2 = this.player2.placeCardInProvince('karada-district', 'province 1');
                this.fireElementalGuard = this.player2.findCardByName('fire-elemental-guard');
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
            });

            describe('if costs can be paid', function() {
                beforeEach(function() {
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);
                });

                it('should prompt the player to choose a target', function() {
                    expect(this.player2).toHavePrompt('Choose an attachment');
                });

                it('should allow the player to pay costs first', function() {
                    expect(this.player2.currentButtons).toContain('Pay costs first');
                });

                describe('when a target is chosen', function() {
                    beforeEach(function() {
                        this.player2.clickCard(this.fineKatana);
                    });

                    it('should transfer fate to the target\'s controller', function() {
                        expect(this.player2.fate).toBe(1);
                        expect(this.player1.fate).toBe(4);
                    });
                    describe ('and there is a valid target to attach to', function() {
                        it('should prompt the player to choose a character to give the attachment to', function() {
                            expect(this.player2).toHavePrompt('Choose a character to attach Fine Katana to');
                        });

                        describe('If the player chooses a character to attach to', function() {
                            beforeEach(function() {
                                this.player2.clickCard(this.miyaMystic);
                            });

                            it('should transfer control of the attachment', function() {
                                expect(this.fineKatana.controller).toBe(this.player2.player);
                            });

                            it('should attach the target to the character', function() {
                                expect(this.miyaMystic.attachments.toArray()).toContain(this.fineKatana);
                            });
                        });
                    });
                });
            });

            describe('if costs cannot be paid', function() {
                beforeEach(function() {
                    this.player2.fate = 0;
                });
                it('should not allow the event to be played', function() {
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);

                    expect(this.game.currentActionWindow).not.toBe(null);
                    expect(this.player2).not.toHavePrompt('Choose an attachment');
                });
            });

            describe('if there is no target to attach to', function() {
                it('should discard the attachment', function() {
                    this.game.manualMode = true;
                    this.player2.dragCard(this.fireElementalGuard, 'dynasty discard pile');
                    this.player2.dragCard(this.miyaMystic, 'dynasty discard pile');
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);
                    this.player2.clickCard(this.fineKatana);
                    expect(this.fineKatana.location).toBe('conflict discard pile');
                });
            });

            describe('if no characters can legally hold the attachment', function() {
                it('should discard the attachment', function() {
                    this.game.manualMode = true;
                    this.player2.dragCard(this.miyaMystic, 'dynasty discard pile');
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);
                    this.player2.clickCard(this.fineKatana);
                    expect(this.fineKatana.location).toBe('conflict discard pile');
                });
            });

            describe('if the attachment is already owned', function() {
                it('should discard the attachment', function() {
                    this.cloudTheMind = this.player1.playAttachment('cloud-the-mind', this.fireElementalGuard);
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.karada1);
                    this.player1.clickCard(this.cloudTheMind);
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                });
            });

            describe('if Watch Commander is chosen', function() {
                it('should be attached to the chosen character, and not discarded', function() {
                    this.watchCommander = this.player1.playAttachment('watch-commander', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);
                    this.player2.clickCard(this.watchCommander);
                    this.player2.clickCard(this.miyaMystic);

                    expect(this.watchCommander.controller).toBe(this.player2.player);
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.watchCommander);
                });
            });

            describe('if the attachment has been used already this turn', function() {
                it('should be usable by the other player', function() {
                    this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                    this.oniMask = this.player1.playAttachment('oni-mask', 'adept-of-the-waves');
                    this.adeptOfTheWaves.fate = 1;
                    this.miyaMystic.fate = 1;
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.adeptOfTheWaves],
                        defenders: [this.miyaMystic]
                    });
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.oniMask);
                    this.player1.clickCard(this.miyaMystic);
                    expect(this.miyaMystic.isBlank()).toBe(true);
                    this.player2.clickCard(this.karada2);
                    this.player2.clickCard(this.oniMask);
                    this.player2.clickCard(this.miyaMystic);
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.oniMask);
                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard(this.oniMask);
                    expect(this.player2).toHavePrompt('Oni Mask');
                });
            });

            describe('when the attachment is removed', function() {
                it('should discard any now illegally attached attachments', function() {
                    this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                    this.favoredMount = this.player1.playAttachment('favored-mount', 'adept-of-the-waves');
                    this.player2.pass();
                    this.bornInWar = this.player1.playAttachment('born-in-war', 'adept-of-the-waves');
                    this.player2.clickCard(this.karada2);
                    this.player2.clickCard(this.favoredMount);
                    this.player2.clickCard(this.miyaMystic);
                    expect(this.adeptOfTheWaves.hasTrait('cavalry')).toBe(false);
                    expect(this.adeptOfTheWaves.attachments.toArray()).not.toContain(this.favoredMount);
                    expect(this.adeptOfTheWaves.attachments.toArray()).not.toContain(this.bornInWar);
                    expect(this.bornInWar.location).toBe('conflict discard pile');
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.favoredMount);
                });
            });
        });
    });
});

