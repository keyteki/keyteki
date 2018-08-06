describe('Togashi Mitsu', function() {
    integration(function() {
        describe('Togashi Mitsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-mitsu', 'niten-master'],
                        conflictDiscard: ['tattooed-wanderer', 'hurricane-punch', 'hawk-tattoo']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['togashi-mitsu']
                });
                this.player1.clickPrompt('No Target');
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
            });

            it('should allow playing a monk character', function() {
                expect(this.player1).toHavePrompt('Togashi Mitsu');
                this.tattooedWanderer = this.player1.clickCard('tattooed-wanderer');
                expect(this.player1).toHavePrompt('Tattooed Wanderer');
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.tattooedWanderer.inConflict).toBe(true);
            });

            it('should allow playing a kiho', function() {
                this.hurricanePunch = this.player1.clickCard('hurricane-punch');
                expect(this.player1).toHavePrompt('Hurricane Punch');
                this.player1.clickCard(this.togashiMitsu);
                expect(this.togashiMitsu.militarySkill).toBe(6);
                expect(this.player1.player.conflictDeck.last()).toBe(this.hurricanePunch);
            });

            it('should allow playing a tattoo', function() {
                this.hawkTattoo = this.player1.clickCard('hawk-tattoo');
                expect(this.player1).toHavePrompt('Hawk Tattoo');
                this.nitenMaster = this.player1.clickCard('niten-master');
                expect(this.nitenMaster.militarySkill).toBe(4);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
            });

            it('should allow playing an attachmonk as an attachment', function() {
                expect(this.player1).toHavePrompt('Togashi Mitsu');
                this.tattooedWanderer = this.player1.clickCard('tattooed-wanderer');
                expect(this.player1).toHavePrompt('Tattooed Wanderer');
                this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
                expect(this.player1).toHavePrompt('Tattooed Wanderer');
                this.nitenMaster = this.player1.clickCard('niten-master');
                expect(this.nitenMaster.attachments.toArray()).toContain(this.tattooedWanderer);
                expect(this.nitenMaster.isCovert()).toBe(true);
            });
        });
    });
});
