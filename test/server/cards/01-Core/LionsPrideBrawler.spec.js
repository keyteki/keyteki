describe('Lion\'s Pride Brawler', function() {
    integration(function() {
        describe('Lion\'s Pride Brawler\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['lion-s-pride-brawler'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['otomo-courtier', 'shiba-tsukune', 'seppun-guardsman']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['lion-s-pride-brawler'],
                    defenders: ['seppun-guardsman']
                });
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.otomoCourtier = this.player2.findCardByName('otomo-courtier');
                this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
                this.player2.pass();
            });

            it('should allow bowing cards with lower mil skill', function() {
                this.lionsPrideBrawler = this.player1.clickCard('lion-s-pride-brawler');
                expect(this.player1).toHavePrompt('Lion\'s Pride Brawler');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            });

            it('should be able to target cards outside the conflict, or with a mil dash', function() {
                this.lionsPrideBrawler = this.player1.clickCard('lion-s-pride-brawler');
                expect(this.player1).toHavePrompt('Lion\'s Pride Brawler');
                expect(this.player1).toBeAbleToSelect(this.otomoCourtier);
            });

            it('should allow bowing cards with lower mil skill after buffs', function() {
                this.player1.playAttachment('fine-katana', 'lion-s-pride-brawler');
                this.player2.pass();
                this.lionsPrideBrawler = this.player1.clickCard('lion-s-pride-brawler');
                expect(this.player1).toHavePrompt('Lion\'s Pride Brawler');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            it('should bow the target', function() {
                this.lionsPrideBrawler = this.player1.clickCard('lion-s-pride-brawler');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.bowed).toBe(true);
                expect(this.seppunGuardsman.inConflict).toBe(true);
            });
        });
    });
});
