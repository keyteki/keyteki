describe('For Shame!', function() {
    integration(function() {
        describe('For Shame!\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider', 'aggressive-moto', 'iuchi-wayfinder'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['steward-of-law', 'mirumoto-s-fury', 'for-shame']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shinjo-outrider', 'aggressive-moto'],
                    defenders: ['doji-challenger', 'doji-whisperer']
                });
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.moto = this.player1.findCardByName('aggressive-moto');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should only be playable when you have a courtier', function() {
                this.player2.clickCard('mirumoto-s-fury');
                this.player2.clickCard(this.outrider);
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.whisperer);
                this.player2.clickCard('for-shame');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable on a target which is not participating, or which cannot be bowed or dishonored', function() {
                this.player2.clickCard('mirumoto-s-fury');
                this.player2.clickCard(this.outrider);
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.whisperer);
                this.stewardOfLaw = this.player2.playCharacterFromHand('steward-of-law');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('for-shame');
                expect(this.player2).toHavePrompt('For Shame!');
                expect(this.player2).toBeAbleToSelect(this.moto);
                expect(this.player2).not.toBeAbleToSelect(this.outrider);
                expect(this.player2).not.toBeAbleToSelect(this.wayfinder);
                expect(this.player2).not.toBeAbleToSelect(this.stewardOfLaw);
            });

            it('should prompt to bow or dishonor a character', function() {
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.outrider);
                expect(this.player1.currentButtons).toContain('Dishonor this character');
                expect(this.player1.currentButtons).toContain('Bow this character');
            });

            it('should dishonor the target if that option is selected', function() {
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.outrider);
                this.player1.clickPrompt('Dishonor this character');
                expect(this.outrider.isDishonored).toBe(true);
                expect(this.outrider.bowed).toBe(false);
            });

            it('should bow the target if that option is selected', function() {
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.outrider);
                this.player1.clickPrompt('Bow this character');
                expect(this.outrider.isDishonored).toBe(false);
                expect(this.outrider.bowed).toBe(true);
            });

            it('should bow the target if it cannot be dishonored', function() {
                this.player2.playCharacterFromHand('steward-of-law');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.outrider);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.outrider.isDishonored).toBe(false);
                expect(this.outrider.bowed).toBe(true);
            });

            it('should dishonor the target if it cannot be bowed', function() {
                this.player2.clickCard('mirumoto-s-fury');
                this.player2.clickCard(this.outrider);
                expect(this.outrider.bowed).toBe(true);
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.outrider);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.outrider.isDishonored).toBe(true);
                expect(this.outrider.bowed).toBe(true);
            });
        });
    });
});
