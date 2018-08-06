describe('Even the Odds', function() {
    integration(function() {
        describe('Even the Odds\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'miwaku-kabe-guard'],
                        hand: ['seal-of-the-lion', 'even-the-odds']
                    },
                    player2: {
                        inPlay: ['kakita-kaezin', 'doji-challenger']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.noMoreActions();
            });

            it('should not be playable if not outnumbered', function() {
                this.initiateConflict({
                    attackers: ['miwaku-kabe-guard'],
                    defenders: ['kakita-kaezin']
                });
                this.player2.pass();
                this.player1.clickCard('even-the-odds');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable if no character can join the conflict and is not a commander', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['miwaku-kabe-guard'],
                    defenders: ['kakita-kaezin', 'doji-challenger']
                });
                this.player2.pass();
                this.player1.clickCard('even-the-odds');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should move a character into the conflict', function() {
                this.initiateConflict({
                    attackers: ['miwaku-kabe-guard'],
                    defenders: ['kakita-kaezin', 'doji-challenger']
                });
                this.player2.pass();
                this.player1.clickCard('even-the-odds');
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.inConflict).toBe(true);
                expect(this.matsuBerserker.isHonored).toBe(false);
            });

            it('should move a character into the conflict and honor it if it\'s a commander', function() {
                this.initiateConflict({
                    attackers: ['miwaku-kabe-guard'],
                    defenders: ['kakita-kaezin', 'doji-challenger']
                });
                this.player2.pass();
                this.player1.playAttachment('seal-of-the-lion', this.matsuBerserker);
                this.player2.pass();
                this.player1.clickCard('even-the-odds');
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.inConflict).toBe(true);
                expect(this.matsuBerserker.isHonored).toBe(true);
            });

            it('should honor a commander if it cannot move into the conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['miwaku-kabe-guard'],
                    defenders: ['kakita-kaezin', 'doji-challenger']
                });
                this.player2.pass();
                this.player1.playAttachment('seal-of-the-lion', this.matsuBerserker);
                this.player2.pass();
                this.player1.clickCard('even-the-odds');
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.inConflict).toBe(false);
                expect(this.matsuBerserker.isHonored).toBe(true);
            });
        });
    });
});
