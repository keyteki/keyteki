describe('Hawk Tattoo', function() {
    integration(function() {
        describe('Hawk Tattoo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tattooed-wanderer', 'ancient-master'],
                        hand: ['hawk-tattoo']
                    },
                    player2: {
                        inPlay: ['seppun-guardsman', 'adept-of-the-waves']
                    }
                });
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['ancient-master'],
                    defenders: ['seppun-guardsman']
                });
                this.player2.pass();
            });

            it('should move a friendly character to the conflict', function() {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', this.tattooedWanderer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
                this.player1.clickCard(this.hawkTattoo);
                expect(this.tattooedWanderer.inConflict).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should move an opposing character to the conflict', function() {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
                this.player1.clickCard(this.hawkTattoo);
                expect(this.adeptOfTheWaves.inConflict).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not pass priority if played on a character in the conflict', function() {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', 'ancient-master');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
                this.player1.clickCard(this.hawkTattoo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if played on a character in the conflict who is not a monk', function() {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', this.seppunGuardsman);
                expect(this.seppunGuardsman.attachments.toArray()).toContain(this.hawkTattoo);
                expect(this.hawkTattoo.location).toBe('play area');
                expect(this.seppunGuardsman.hasTrait('tattooed')).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
