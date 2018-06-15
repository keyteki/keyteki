describe('Cautious Scout', function() {
    integration(function() {
        describe('Cautious Scout\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['cautious-scout'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        role: 'keeper-of-void',
                        inPlay: ['shinjo-outrider'],
                        hand: ['talisman-of-the-sun'],
                        provinces: ['rally-to-the-cause', 'secret-cache', 'fertile-fields','public-forum']
                    }
                });
                this.player1.playAttachment('fine-katana', 'cautious-scout');
                this.talismanOfTheSun = this.player2.playAttachment('talisman-of-the-sun', 'shinjo-outrider');
                this.noMoreActions();
            });

            it('should work on provinces with a reveal reaction', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'rally-to-the-cause',
                    attackers: ['cautious-scout']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with a declare reaction when they are facedown', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'secret-cache',
                    attackers: ['cautious-scout']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with a declare reaction when they are faceup', function() {
                this.secretCache = this.player2.findCardByName('secret-cache');
                this.secretCache.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    province: 'secret-cache',
                    attackers: ['cautious-scout']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with an action', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'fertile-fields',
                    attackers: ['cautious-scout'],
                    defenders: []
                });
                expect(this.player2.player.hand.size()).toBe(0);
                this.player2.clickCard('fertile-fields');
                expect(this.player2.player.hand.size()).toBe(0);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on provinces with a reaction to breaking', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'public-forum',
                    attackers: ['cautious-scout'],
                    defenders: []
                });
                this.publicForum = this.player2.findCardByName('public-forum');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Public Forum');
                expect(this.publicForum.isBroken).toBe(true);
            });

            it('should work on provinces after Talisman of the Sun is used', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'public-forum',
                    attackers: ['cautious-scout'],
                    defenders: []
                });
                this.player2.clickCard(this.talismanOfTheSun);
                this.rallyToTheCause = this.player2.clickCard('rally-to-the-cause');
                expect(this.game.currentConflict.conflictProvince).toBe(this.rallyToTheCause);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
