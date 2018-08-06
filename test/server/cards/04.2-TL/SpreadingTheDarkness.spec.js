describe('Spreading the Darkness', function() {
    integration(function() {
        describe('Spreading the Darkness\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['child-of-the-plains'],
                        hand: ['spreading-the-darkness']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['assassination', 'cloud-the-mind', 'spreading-the-darkness']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['child-of-the-plains']
                });
            });

            it('should cost 2 honor', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.childOfThePlains = this.player1.clickCard('child-of-the-plains');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('spreading-the-darkness');
                this.player1.clickCard(this.childOfThePlains);
                expect(this.player1.honor).toBe(8);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should increase mil by 4', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.childOfThePlains = this.player1.clickCard('child-of-the-plains');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('spreading-the-darkness');
                this.player1.clickCard(this.childOfThePlains);
                expect(this.childOfThePlains.militarySkill).toBe(5);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prevent targeting by opponent\'s events', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.childOfThePlains = this.player1.clickCard('child-of-the-plains');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('spreading-the-darkness');
                this.player1.clickCard(this.childOfThePlains);
                this.player2.clickCard('assassination');
                expect(this.player2).toHavePrompt('Assassination');
                expect(this.player2).toBeAbleToSelect('solemn-scholar');
                expect(this.player2).not.toBeAbleToSelect(this.childOfThePlains);
            });

            it('should not prevent attaching attachments to that character', function() {
                this.childOfThePlains = this.player1.clickCard('child-of-the-plains');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('spreading-the-darkness');
                this.player1.clickCard(this.childOfThePlains);
                this.player2.clickCard('cloud-the-mind');
                expect(this.player2).toHavePrompt('Cloud the Mind');
                expect(this.player2).toBeAbleToSelect('solemn-scholar');
                expect(this.player2).toBeAbleToSelect(this.childOfThePlains);
            });

            it('should not prevent targeting that character with ring effects', function() {
                this.childOfThePlains = this.player1.clickCard('child-of-the-plains');
                this.solemnScholar = this.player2.clickCard('solemn-scholar');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('spreading-the-darkness');
                this.player1.clickCard(this.childOfThePlains);
                this.player2.clickCard('spreading-the-darkness');
                this.player2.clickCard(this.solemnScholar);
                expect(this.solemnScholar.militarySkill).toBe(5);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);
                this.player1.clickCard(this.solemnScholar);
                this.player1.clickPrompt('Dishonor Solemn Scholar');
                expect(this.solemnScholar.isDishonored).toBe(true);
            });
        });
    });
});
