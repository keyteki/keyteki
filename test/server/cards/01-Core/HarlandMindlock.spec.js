describe('Harland Mindlock', function() {
    integration(function() {
        describe('Harland Mindlock\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['dextre', 'dust-imp'],
                        hand: ['harland-mindlock', 'phase-shift', 'sergeant-zakiel']
                    },
                    player2: {
                        inPlay: ['troll', 'valdr']
                    }
                });
            });

            it('should take control of a creature until it leaves play', function() {
                this.player1.play(this.harlandMindlock);
                expect(this.player1).toHavePrompt('Harland Mindlock');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Troll');
                this.player1.clickPrompt('Left');
                expect(this.troll.controller).toBe(this.player1.player);
                this.player1.play(this.phaseShift);
                this.player1.play(this.sergeantZakiel);
                this.player1.clickCard(this.sergeantZakiel);
                this.player1.clickCard(this.harlandMindlock);
                this.player1.clickCard(this.valdr);
                expect(this.harlandMindlock.location).toBe('discard');
                expect(this.player1).toHavePrompt('Troll');
                this.player1.clickPrompt('Right');
                expect(this.player2.player.cardsInPlay[0]).toBe(this.troll);
            });

            it('should give the player the choice to trigger their new creature', function() {
                this.player1.play(this.harlandMindlock);
                expect(this.player1).toHavePrompt('Harland Mindlock');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Troll');
                this.player1.clickPrompt('Left');
                expect(this.troll.controller).toBe(this.player1.player);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                expect(this.player1).toHavePromptButton('brobnar');
            });
        });
    });
});
