describe('Policy Debate', function() {
    integration(function() {
        describe('when used during a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['prodigy-of-the-waves', 'seppun-guardsman', 'solemn-scholar'],
                        hand: ['supernatural-storm']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['savvy-politician', 'doji-whisperer'],
                        hand: ['kakita-blade', 'policy-debate']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['prodigy-of-the-waves', 'seppun-guardsman'],
                    defenders: ['savvy-politician']
                });
                this.prodigyOfTheWaves = this.player1.findCardByName('prodigy-of-the-waves');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.savvyPolitician = this.player2.findCardByName('savvy-politician');
                this.policyDebate = this.player2.findCardByName('policy-debate');
            });

            it('should allow targeting of characters without a dash who are participating', function() {
                this.player2.clickCard('policy-debate');
                expect(this.player2).toHavePrompt('Policy Debate');
                expect(this.player2).not.toBeAbleToSelect('doji-whisperer');
                expect(this.player2).toBeAbleToSelect(this.savvyPolitician);
                this.player2.clickCard(this.savvyPolitician);
                expect(this.player2).toBeAbleToSelect(this.prodigyOfTheWaves);
                expect(this.player2).not.toBeAbleToSelect(this.seppunGuardsman);
                expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            });

            it('should initiate a duel', function() {
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePrompt('Honor Bid');
            });

            it('should activate duel buffs', function() {
                this.kakitaBlade = this.player2.playAttachment('kakita-blade', this.savvyPolitician);
                this.player1.pass();
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.savvyPolitician.politicalSkill).toBe(4);
            });

            it('should trade honor', function() {
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.player1.player.honor).toBe(13);
                expect(this.player2.player.honor).toBe(9);
            });

            it('should buff targets by their bid', function() {
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.prodigyOfTheWaves.politicalSkill).toBe(4);
                expect(this.savvyPolitician.politicalSkill).toBe(5);
            });

            it('should prompt the winner to discard a card from the losers hand, and discard that card', function() {
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.player2).toHavePrompt('Policy Debate');
                expect(this.player2.currentButtons).toContain('Supernatural Storm');
                this.player2.clickPrompt('Supernatural Storm');
                this.supernaturalStorm = this.player1.findCardByName('supernatural-storm');
                expect(this.supernaturalStorm.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should correctly trigger and resolve on duel won abilities', function() {
                this.kakitaBlade = this.player2.playAttachment('kakita-blade', this.savvyPolitician);
                this.player1.pass();
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                this.player2.clickPrompt('Supernatural Storm');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kakitaBlade);
                this.player2.clickCard(this.kakitaBlade);
                expect(this.player2.honor).toBe(10);
            });
        });
    });
});
