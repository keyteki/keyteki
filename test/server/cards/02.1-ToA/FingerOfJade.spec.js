describe('Finger of Jade', function() {
    integration(function() {
        describe('Finger of Jade\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['unassuming-yojimbo', 'young-rumormonger'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        stronghold: 'mountain-s-anvil-castle',
                        inPlay: ['doomed-shugenja', 'niten-master'],
                        hand: ['finger-of-jade', 'display-of-power']
                    }
                });
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.unassumingYojimbo = this.player1.findCardByName('unassuming-yojimbo');
                this.player1.pass();
            });

            it('shouldn\'t be playable on opponent\'s characters', function() {
                this.player2.clickCard('finger-of-jade');
                expect(this.player2).toHavePrompt('Choose a card');
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).not.toBeAbleToSelect(this.unassumingYojimbo);
            });

            it('should prompt the player to cancel when an event is used against its character', function() {
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', 'doomed-shugenja');
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fingerOfJade);
                this.player2.clickCard(this.fingerOfJade);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.doomedShugenja.bowed).toBe(false);
                expect(this.fingerOfJade.location).toBe('conflict discard pile');
            });

            it('should not prompt the player when targeted with their own abilities', function() {
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', 'doomed-shugenja');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['young-rumormonger'],
                    defenders: [this.doomedShugenja]
                });
                this.mountainsAnvilCastle = this.player2.clickCard('mountain-s-anvil-castle');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.mountainsAnvilCastle.bowed).toBe(true);
                expect(this.doomedShugenja.getMilitarySkill()).toBe(4);
            });

            it('should prompt the player for their own abilities when the correct setting is activated', function() {
                this.player2.player.optionSettings.cancelOwnAbilities = true;
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', 'doomed-shugenja');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['young-rumormonger'],
                    defenders: [this.doomedShugenja]
                });
                this.mountainsAnvilCastle = this.player2.clickCard('mountain-s-anvil-castle');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fingerOfJade);
            });

            it('should prompt to cancel opponent\'s abilities', function() {
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', 'doomed-shugenja');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['young-rumormonger'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard('display-of-power');
                expect(this.player2).toHavePrompt('Fire Ring');
                this.nitenMaster = this.player2.clickCard('niten-master');
                this.player2.clickPrompt('Honor Niten Master');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard('young-rumormonger');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.fingerOfJade);
                expect(this.nitenMaster.isHonored).toBe(true);
                expect(this.doomedShugenja.isHonored).toBe(false);
                expect(this.fingerOfJade.location).toBe('conflict discard pile');
            });
        });
    });
});
