describe('Abandoning Honor', function() {
    integration(function() {
        describe('Abandoning Honor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender','third-tower-guard'],
                        hand:['fine-katana']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['way-of-the-scorpion','fiery-madness'],
                        provinces: ['abandoning-honor']
                    }
                });

                this.bd = this.player1.findCardByName('borderlands-defender');
                this.fk = this.player1.findCardByName('fine-katana');
                this.ttg = this.player1.findCardByName('third-tower-guard');

                this.shoju = this.player2.findCardByName('bayushi-shoju');
                this.wots = this.player2.findCardByName('way-of-the-scorpion');
                this.madness = this.player2.findCardByName('fiery-madness');
                this.honor = this.player2.findCardByName('abandoning-honor');
                this.noMoreActions();
            });

            it('should not trigger if there is no dishonored character in play', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['borderlands-defender'],
                    province: this.honor,
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.fk);
                this.player1.clickCard(this.bd);
                this.player2.pass();
                expect(this.bd.militarySkill).toBe(5);
                this.player1.pass();
                expect(this.player2).not.toBeAbleToSelect(this.honor);
            });

            it('should trigger if there is a dishonored character in play', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['borderlands-defender'],
                    province: this.honor,
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.fk);
                this.player1.clickCard(this.bd);
                expect(this.bd.militarySkill).toBe(5);
                this.player2.clickCard(this.wots);
                this.player2.clickCard(this.bd);
                expect(this.bd.militarySkill).toBe(4);
                this.player1.pass();
                this.player2.pass();
                expect(this.player2).toBeAbleToSelect(this.honor);
            });

            it('should correctly discard the dishonored character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['borderlands-defender'],
                    province: this.honor,
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.fk);
                this.player1.clickCard(this.bd);
                expect(this.bd.militarySkill).toBe(5);
                this.player2.clickCard(this.wots);
                this.player2.clickCard(this.bd);
                expect(this.bd.militarySkill).toBe(4);
                this.player1.pass();
                this.player2.pass();
                expect(this.player2).toBeAbleToSelect(this.honor);
                this.player2.clickCard(this.honor);
                expect(this.player2).toBeAbleToSelect(this.bd);
                expect(this.player2).not.toBeAbleToSelect(this.ttg);
                this.player2.clickCard(this.bd);
                expect(this.bd.location).toBe('dynasty discard pile');
            });


        });
    });
});
