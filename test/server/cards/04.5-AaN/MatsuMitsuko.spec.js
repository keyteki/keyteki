describe('Matsu Mitsuko', function() {
    integration(function() {
        describe('Matsu Mitsuko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-mitsuko','matsu-berserker','venerable-historian'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        honor: 10
                    }
                });

                this.mitsuko = this.player1.findCardByName('matsu-mitsuko');
                this.berzerker = this.player1.findCardByName('matsu-berserker');
                this.historian = this.player1.findCardByName('venerable-historian');

                this.scout = this.player2.findCardByName('eager-scout');
                this.noMoreActions();
            });


            it('should not work during a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.historian],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mitsuko);
                expect(this.player1).toHavePromptButton('Pass');
            });

            it('should work during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berzerker],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mitsuko);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should not work if lower honor', function() {
                this.player1.player.honor = 9;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berzerker],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mitsuko);
                expect(this.player1).toHavePromptButton('Pass');
            });

            it('should not work if even honor', function() {
                this.player1.player.honor = 10;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berzerker],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mitsuko);
                expect(this.player1).toHavePromptButton('Pass');
            });

            it('should correctly move the chosen character to the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berzerker],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mitsuko);
                expect(this.player1).toBeAbleToSelect(this.mitsuko);
                expect(this.player1).not.toBeAbleToSelect(this.berzerker);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                this.player1.clickCard(this.mitsuko);
                expect(this.mitsuko.isParticipating()).toBe(true);
            });
        });
    });
});
