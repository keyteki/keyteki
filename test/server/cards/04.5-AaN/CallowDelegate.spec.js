describe('Callow Delegate', function() {
    integration(function() {
        describe('Callow Delegate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 9,
                        inPlay: ['bayushi-shoju'],
                        hand: ['assassination']
                    },
                    player2: {
                        honor: 9,
                        inPlay: ['callow-delegate', 'doji-challenger']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.assassination = this.player1.findCardByName('assassination');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiShoju],
                    defenders: [this.callowDelegate]
                });
                this.player2.pass();
            });

            it('should prompt to honor a character when leaving play', function() {
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Callow Delegate');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.bayushiShoju);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.callowDelegate.location).toBe('dynasty discard pile');
                expect(this.dojiChallenger.isHonored).toBe(true);
            });

            it('should increase player honor if callow delegate is the target of the interupt', function() {
                let player2HonorBefore = this.player2.honor;
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Callow Delegate');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.callowDelegate.location).toBe('dynasty discard pile');
                expect(this.player2.honor).toBe(player2HonorBefore + 1);
            });
        });
    });
});
