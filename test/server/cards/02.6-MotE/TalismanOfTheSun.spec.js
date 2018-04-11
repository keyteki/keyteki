describe('Talisman of the Sun', function() {
    integration(function() {
        describe('Talisman of the Sun\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden']
                    },
                    player2: {
                        provinces: ['public-forum', 'sanpuku-seido'],
                        inPlay: ['serene-warrior'],
                        hand: ['talisman-of-the-sun']
                    }
                });
                this.player1.pass();
                this.talismanOfTheSun = this.player2.playAttachment('talisman-of-the-sun', 'serene-warrior');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    province: 'public-forum',
                    attackers: ['shrine-maiden'],
                    defenders: ['serene-warrior']
                });
            });

            it('should move the conflict to a new province', function() {
                this.player2.clickCard(this.talismanOfTheSun);
                expect(this.player2).toHavePrompt('Talisman of the Sun');
                this.sanpukuSeido = this.player2.clickCard('sanpuku-seido');
                expect(this.sanpukuSeido.inConflict).toBe(true);
                expect(this.game.currentConflict.conflictProvince).toBe(this.sanpukuSeido);
            });

            it('should apply any constant abilities of the new province', function() {
                this.player2.clickCard(this.talismanOfTheSun);
                this.sanpukuSeido = this.player2.clickCard('sanpuku-seido');
                expect(this.game.currentConflict.attackerSkill).toBe(0);
                expect(this.game.currentConflict.defenderSkill).toBe(4);
            });
        });
    });
});
