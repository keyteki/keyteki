describe('Guidance of the Ancestors', function() {
    integration(function() {
        describe('Guidance of the Ancestors\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['matsu-berserker'],
                        conflictDiscard: ['guidance-of-the-ancestors']
                    },
                    player2: {
                        hand: ['assassination']
                    }
                });
                this.noMoreActions();
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.guidanceOfTheAncestors = this.player1.findCardByName('guidance-of-the-ancestors', 'conflict discard pile');
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
            });

            it('should let you play it from the discard pile', function() {
                this.player2.pass();
                this.guidanceOfTheAncestors = this.player1.clickCard('guidance-of-the-ancestors');
                expect(this.player1).toHavePrompt('Guidance of the Ancestors');
                this.player1.clickCard(this.matsuBerserker);
                expect(this.guidanceOfTheAncestors.location).toBe('play area');
                expect(this.player1.fate).toBe(0);
                expect(this.matsuBerserker.attachments.toArray()).toContain(this.guidanceOfTheAncestors);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not allow you to play it if you can\'t pay the cost', function() {
                this.player1.fate = 0;
                this.player2.pass();
                this.guidanceOfTheAncestors = this.player1.clickCard('guidance-of-the-ancestors');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not allow you to play it if there aren\'t any legal targets', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                this.guidanceOfTheAncestors = this.player1.clickCard('guidance-of-the-ancestors');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
