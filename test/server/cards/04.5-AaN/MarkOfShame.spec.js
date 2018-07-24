describe('Mark of Shame', function() {
    integration(function() {
        describe('Mark of Shame\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['young-rumormonger'],
                        hand: ['mark-of-shame']
                    },
                    player2: {
                        inPlay: ['akodo-toturi','matsu-berserker']
                    }
                });
                this.mos = this.player1.findCardByName('mark-of-shame');
                this.rumor = this.player1.findCardByName('young-rumormonger');

                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.zerk = this.player2.findCardByName('matsu-berserker');
            });

            it('should not be trigger if the character is already dishonored', function() {
                this.toturi.dishonor();
                this.player1.clickCard(this.mos);
                this.player1.clickCard(this.toturi);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('should correctly dishonor attached character', function() {
                this.toturi.honor();
                this.player1.clickCard(this.mos);
                this.player1.clickCard(this.toturi);
                expect(this.player1).toBeAbleToSelect(this.mos);
                this.player1.clickCard(this.mos);
                //Rumormonger pass
                this.player1.clickPrompt('Pass');
                //Rumormonger pass
                this.player1.clickPrompt('Pass');
                expect(this.toturi.isDishonored).toBe(true);
            });

            it('should not dishonor a second time if the first dishonor is redirected', function() {
                this.toturi.honor();
                this.player1.clickCard(this.mos);
                this.player1.clickCard(this.toturi);
                expect(this.player1).toBeAbleToSelect(this.mos);
                this.player1.clickCard(this.mos);
                this.player1.clickCard(this.rumor);
                this.player1.clickCard(this.zerk);
                expect(this.toturi.isHonored).toBe(true);
                expect(this.zerk.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('should allow young rumormonger to redirect second dishonor if the pre-then is paid', function() {
                this.toturi.honor();
                this.player1.clickCard(this.mos);
                this.player1.clickCard(this.toturi);
                this.player1.clickCard(this.mos);
                this.player1.pass();
                expect(this.toturi.isHonored).toBe(false);
                expect(this.zerk.isDishonored).toBe(false);
                expect(this.player1).toBeAbleToSelect(this.rumor);
                this.player1.clickCard(this.rumor);
                expect(this.player1).toBeAbleToSelect(this.zerk);
                this.player1.clickCard(this.zerk);
                expect(this.zerk.isDishonored).toBe(true);
            });

        });
    });
});
