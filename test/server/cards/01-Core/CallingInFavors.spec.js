describe('Calling In Favors', function() {
    integration(function() {
        describe('When playing Calling In Favors', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'seppun-guardsman'],
                        hand: ['fine-katana', 'watch-commander', 'favored-mount', 'born-in-war', 'oni-mask']
                    },
                    player2: {
                        inPlay: ['miya-mystic', 'ascetic-visionary'],
                        dynastyDeck: ['young-rumormonger'],
                        hand: ['calling-in-favors']
                    }
                });
                this.asceticVisionary = this.player2.findCardByName('ascetic-visionary');
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
            });

            describe('if costs can be paid', function() {
                beforeEach(function() {
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
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

                    it('should prompt the player to pay costs', function() {
                        expect(this.player2).toHavePrompt('Select character to dishonor');
                    });

                    describe('and costs are paid', function() {
                        beforeEach(function() {
                            this.player2.clickCard('miya-mystic');
                        });

                        it('should dishonor the character chosen', function() {
                            expect(this.miyaMystic.isDishonored).toBe(true);
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

            describe('if costs cannot be paid', function() {
                it('should not allow the event to be played', function() {
                    this.miyaMystic.isDishonored = true;
                    this.asceticVisionary.isDishonored = true;
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');

                    expect(this.player2.player.canInitiateAction).toBe(true);
                    expect(this.player2).not.toHavePrompt('Choose an attachment');
                });
            });

            describe('if Watch Commander is chosen', function() {
                it('should be attached to the chosen character, and not discarded', function() {
                    this.watchCommander = this.player1.playAttachment('watch-commander', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
                    this.player2.clickCard(this.watchCommander);
                    this.player2.clickCard('miya-mystic');

                    expect(this.watchCommander.controller).toBe(this.player2.player);
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.watchCommander);
                });
            });

            describe('if the chosen character cannot legally attach the chosen attachment', function() {
                beforeEach(function() {
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
                    this.player2.clickCard(this.fineKatana);
                });

                it('should allow the character to be chosen', function() {
                    expect(this.player2).toBeAbleToSelect(this.asceticVisionary);
                });

                it('should dishonor the character when chosen and discard the attachment', function() {
                    this.player2.clickCard(this.asceticVisionary);

                    expect(this.asceticVisionary.isDishonored).toBe(true);
                    expect(this.asceticVisionary.attachments.toArray()).not.toContain(this.fineKatana);
                    expect(this.fineKatana.location).toBe('conflict discard pile');
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
                    this.player2.clickCard('calling-in-favors');
                    this.player2.clickCard(this.oniMask);
                    this.player2.clickCard(this.miyaMystic);
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.oniMask);
                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard(this.oniMask);
                    expect(this.player2).toHavePrompt('Oni Mask');
                });
            });

            describe('if the attachment has trait requirements not met by the chosen character', function() {
                beforeEach(function() {
                    this.favoredMount = this.player1.playAttachment('favored-mount', 'adept-of-the-waves');
                    this.player2.clickPrompt('Pass');
                    this.bornInWar = this.player1.playAttachment('born-in-war', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
                    this.player2.clickCard(this.bornInWar);
                });

                it('should allow the character to be chosen', function() {
                    expect(this.player2).toBeAbleToSelect(this.miyaMystic);
                });

                it('should dishonor the character when chosen and discard the attachment', function() {
                    this.player2.clickCard(this.miyaMystic);

                    expect(this.miyaMystic.isDishonored).toBe(true);
                    expect(this.miyaMystic.attachments.toArray()).not.toContain(this.bornInWar);
                    expect(this.bornInWar.location).toBe('conflict discard pile');
                });
            });

            describe('when the attachment is removed', function() {
                it('should discard any now illegally attached attachments', function() {
                    this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                    this.favoredMount = this.player1.playAttachment('favored-mount', 'adept-of-the-waves');
                    this.player2.clickPrompt('Pass');
                    this.bornInWar = this.player1.playAttachment('born-in-war', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
                    this.player2.clickCard(this.favoredMount);
                    this.player2.clickCard(this.miyaMystic);

                    expect(this.miyaMystic.isDishonored).toBe(true);
                    expect(this.miyaMystic.attachments.toArray()).toContain(this.favoredMount);
                    expect(this.adeptOfTheWaves.hasTrait('cavalry')).toBe(false);
                    expect(this.adeptOfTheWaves.attachments.toArray()).not.toContain(this.favoredMount);
                    expect(this.adeptOfTheWaves.attachments.toArray()).not.toContain(this.bornInWar);
                    expect(this.bornInWar.location).toBe('conflict discard pile');
                });
            });

            describe('if Young Rumormonger is in play', function() {
                beforeEach(function() {
                    this.youngRumormonger = this.player2.placeCardInProvince('young-rumormonger', 'province 1');
                    this.player2.putIntoPlay(this.youngRumormonger);
                    this.fineKatana = this.player1.playAttachment('fine-katana', 'adept-of-the-waves');
                    this.player2.clickCard('calling-in-favors', 'hand');
                    this.player2.clickCard(this.fineKatana);
                    this.player2.clickCard('miya-mystic');
                });

                it('should allow Young Rumormonger to use his ability', function() {
                    expect(this.player2.formatPrompt()).toContain('interrupt');
                    expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                });

                describe('and the controller uses his ability to redirect the dishonor to himself', function() {
                    beforeEach(function() {
                        this.player2.clickCard(this.youngRumormonger);
                        this.player2.clickCard(this.youngRumormonger);
                    });

                    it('should dishonor Young Rumormonger, not the original character', function() {
                        expect(this.youngRumormonger.isDishonored).toBe(true);
                        expect(this.miyaMystic.isDishonored).toBe(false);
                    });

                    it('should move the Fine Katana to the original character', function() {
                        expect(this.miyaMystic.attachments.toArray()).toContain(this.fineKatana);
                    });
                });
            });
        });
    });
});

