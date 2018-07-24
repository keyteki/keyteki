describe('Shosuro Sadako', function() {
    integration(function() {
        describe('Shosuro Sadako\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-sadako'],
                        hand: ['court-games', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['court-games', 'cloud-the-mind']
                    }
                });
                this.shosuroSadako = this.player1.findCardByName('shosuro-sadako');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroSadako],
                    defenders: []
                });
            });

            it('should not affect her skills when ordinary', function() {
                expect(this.shosuroSadako.militarySkill).toBe(1);
                expect(this.shosuroSadako.politicalSkill).toBe(1);
            });

            it('should not affect her skills when honored', function() {
                this.player2.pass();
                this.player1.clickCard('court-games');
                this.player1.clickPrompt('Honor a friendly character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isHonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
            });

            it('should increase her skills by her glory when dishonored', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
            });

            it('should be removed when Cloud the mind is played', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                this.player1.playAttachment('fine-katana', this.shosuroSadako);
                expect(this.shosuroSadako.militarySkill).toBe(6);
                this.player2.playAttachment('cloud-the-mind', this.shosuroSadako);
                expect(this.shosuroSadako.militarySkill).toBe(0);
            });
        });
    });
});
