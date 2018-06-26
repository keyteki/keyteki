describe('The Mirror\'s Gaze', function() {
    integration(function() {
        describe('The Mirror\'s Gaze\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        fate: 4,
                        inPlay: ['asahina-storyteller', 'brash-samurai', 'doji-whisperer'],
                        hand: ['the-mirror-s-gaze', 'the-mirror-s-gaze', 'banzai', 'ready-for-battle', 'fine-katana'],
                        conflictDiscardPile: ['banzai']
                    },
                    player2: {
                        fate: 4,
                        inPlay: ['seppun-guardsman'],
                        hand: [
                            'banzai', 'assassination', 'charge', 'forged-edict', 'the-mirror-s-gaze',
                            'for-shame', 'the-path-of-man', 'tranquility', 'calling-in-favors'
                        ],
                        dynastyDeck: ['asako-tsuki', 'isawa-tadaka']
                    }
                });
                this.asakoTsuki = this.player2.placeCardInProvince('asako-tsuki');
                this.isawaTadaka = this.player2.placeCardInProvince('isawa-tadaka', 'province 2');
                this.brashSaumrai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.mirrorGaze = this.player1.playAttachment('the-mirror-s-gaze', 'asahina-storyteller');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSaumrai],
                    defenders: [this.seppunGuardsman]
                });
            });

            it('should copy an opponent\'s event', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
            });

            it('shouldn\'t copy my event', function() {
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.player1.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Done');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow double resolutions from Banzai', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
                this.player1.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                expect(this.player1.honor).toBe(10);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
                this.player1.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.brashSaumrai.militarySkill).toBe(6);
            });

            it('shouldn\'t be stopped by Tadaka', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.isawaTadaka);
                expect(this.isawaTadaka.location).toBe('play area');
                expect(this.isawaTadaka.inConflict).toBe(true);
                this.player1.pass();
                this.player1.pass();
                this.player2.clickCard('banzai');
                expect(this.player2).toHavePrompt('Banzai!');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
            });

            it('shouldn\'t trigger if its controller has already hit max', function() {
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.player1.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Done');
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should use its controller max for that ability', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
                this.player1.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Done');
                this.player1.clickCard('banzai');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be counterable', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.asakoTsuki);
                this.player1.pass();
                this.player1.pass();
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.brashSaumrai);
                this.player1.clickCard(this.brashSaumrai);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('forged-edict');
                this.forgedEdict = this.player2.clickCard('forged-edict');
                this.player2.clickCard(this.asakoTsuki);
                expect(this.asakoTsuki.isDishonored).toBe(true);
                expect(this.forgedEdict.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.brashSaumrai.militarySkill).toBe(2);
            });

            it('should work for actions when its controller doesn\'t meet the play restrictions', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.asakoTsuki);
                this.player1.pass();
                this.player1.pass();
                this.player2.clickCard('for-shame');
                expect(this.player2).toHavePrompt('For Shame!');
                expect(this.player2).toBeAbleToSelect(this.brashSaumrai);
                this.player2.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Dishonor this character');
                expect(this.brashSaumrai.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('For Shame!');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Dishonor this character');
                this.player2.pass();
                expect(this.seppunGuardsman.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should work for reactions when its controller doesn\'t meet the triggering conditions', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.isawaTadaka);
                this.player1.pass();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('the-path-of-man');
                this.player2.clickCard('the-path-of-man');
                expect(this.player2.fate).toBe(5);
                expect(this.player1.fate).toBe(2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1.fate).toBe(4);
            });

            it('should not work for actions which won\'t change the game state', function() {
                this.player2.clickCard('tranquility');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not pay costs', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.brashSaumrai);
                expect(this.brashSaumrai.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Assassination');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(11);
            });

            it('should be able to mirror a mirrored ability', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.asakoTsuki);
                expect(this.asakoTsuki.location).toBe('play area');
                expect(this.asakoTsuki.inConflict).toBe(true);
                this.player1.pass();
                this.player1.pass();
                this.gaze2 = this.player2.playAttachment('the-mirror-s-gaze', this.asakoTsuki);
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Dishonor this character');
                expect(this.brashSaumrai.isDishonored).toBe(true);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('For Shame!');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Dishonor this character');
                this.player2.pass();
                expect(this.seppunGuardsman.isDishonored).toBe(true);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.gaze2);
                this.player2.clickCard(this.gaze2);
                this.player2.clickCard(this.brashSaumrai);
                expect(this.brashSaumrai.bowed).toBe(true);
                this.player1.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger in the same window as other reactions to ability resolution', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.asakoTsuki);
                expect(this.asakoTsuki.location).toBe('play area');
                expect(this.asakoTsuki.inConflict).toBe(true);
                this.player1.pass();
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Bow this character');
                expect(this.brashSaumrai.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('ready-for-battle');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
            });

            it('should be able to use multiple mirrors on the same ability', function() {
                this.player2.clickCard('charge');
                this.player2.clickCard(this.asakoTsuki);
                expect(this.asakoTsuki.location).toBe('play area');
                expect(this.asakoTsuki.inConflict).toBe(true);
                this.player1.pass();
                this.gaze2 = this.player1.findCardByName('the-mirror-s-gaze', 'hand');
                this.player1.playAttachment(this.gaze2, 'asahina-storyteller');
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.brashSaumrai);
                this.player1.clickPrompt('Dishonor this character');
                expect(this.brashSaumrai.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                expect(this.player1).toBeAbleToSelect(this.gaze2);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('For Shame!');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                this.player2.clickPrompt('Dishonor this character');
                this.player2.pass();
                expect(this.seppunGuardsman.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.gaze2);
                this.player1.clickCard(this.gaze2);
                expect(this.player1).toHavePrompt('For Shame!');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                this.player2.pass();
                expect(this.seppunGuardsman.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to discard attachments when mirroring Calling in Favors', function() {
                this.player2.pass();
                this.fineKatana = this.player1.playAttachment('fine-katana', this.brashSaumrai);
                this.player2.clickCard('calling-in-favors');
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.isDishonored).toBe(true);
                expect(this.seppunGuardsman.attachments.toArray()).toContain(this.fineKatana);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mirrorGaze);
                this.player1.clickCard(this.mirrorGaze);
                expect(this.player1).toHavePrompt('Calling in Favors');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                this.player1.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
