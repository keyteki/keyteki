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
                        hand: ['assassination']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
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
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
