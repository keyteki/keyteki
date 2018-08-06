describe('Wicked Tetsubo', function() {
    integration(function() {
        describe('Wicked Tetsubo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['third-tower-guard', 'crisis-breaker'],
                        hand: ['wicked-tetsubo']
                    },
                    player2: {
                        inPlay: ['matsu-berserker','venerable-historian']
                    }
                });

                this.ttg = this.player1.findCardByName('third-tower-guard');
                this.breaker = this.player1.findCardByName('crisis-breaker');
                this.tetsubo = this.player1.findCardByName('wicked-tetsubo');

                this.matsu = this.player2.findCardByName('matsu-berserker');
                this.historian = this.player2.findCardByName('venerable-historian');
            });

            it('should only attach to Berserker characters', function() {
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).not.toBeAbleToSelect(this.ttg);
                expect(this.player1).toBeAbleToSelect(this.breaker);
                expect(this.player1).toBeAbleToSelect(this.matsu);
            });

            it('should not work on defense', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.historian],
                    defenders: [this.breaker]
                });
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.breaker);
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toHavePromptButton('Pass');
            });

            it('should work on offense', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.breaker],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.breaker);
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toBeAbleToSelect(this.historian);
                expect(this.player1).not.toBeAbleToSelect(this.matsu);
            });

            it('should not work on targets with a dash', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.breaker],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.breaker);
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toBeAbleToSelect(this.historian);
                this.player1.clickCard(this.historian);
                expect(this.player1).toHavePromptButton('Political');
                expect(this.player1).not.toHavePromptButton('Military');
            });

            it('should correctly set skill to 0', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.breaker],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.breaker);
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.historian);
                expect(this.player1).toHavePromptButton('Political');
                this.player1.clickPrompt('Political');
                expect(this.historian.politicalSkill).toBe(0);
            });
        });
    });
});
