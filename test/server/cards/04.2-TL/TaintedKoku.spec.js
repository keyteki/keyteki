describe('Tainted Koku', function() {
    integration(function() {
        describe('Tainted Koku\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate','togashi-mendicant'],
                        hand: ['fine-katana','let-go']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['tainted-koku','assassination', 'adopted-kin']
                    }
                });
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.mendicant = this.player1.findCardByName('togashi-mendicant');

                this.koku = this.player2.findCardByName('tainted-koku');
                this.shoju = this.player2.findCardByName('bayushi-shoju');
                this.assa = this.player2.findCardByName('assassination');

            });

            it('should correctly be discarded by Let go ', function() {
                this.player1.pass();
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.player1.clickCard('let-go');
                this.player1.clickCard(this.koku);
                expect(this.koku.location).toBe('conflict discard pile');
            });

            it('should correctly be movable after character leaves play ', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mendicant],
                    defenders: [this.shoju],
                    type: 'political'
                });
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.player1.pass();
                this.player2.clickCard(this.shoju);
                this.player2.clickCard(this.mendicant);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.koku);
                this.player2.clickCard(this.koku);
                expect(this.player2).toHavePrompt('Tainted Koku');
                expect(this.player2).toBeAbleToSelect(this.initiate);
                this.player2.clickCard(this.initiate);
                expect(this.mendicant.location).toBe('dynasty discard pile');
                expect(this.initiate.attachments.toArray()).toContain(this.koku);
            });

            it('should not go back to hand if ancestral and has been moved to another character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mendicant],
                    defenders: [this.shoju],
                    type: 'political'
                });
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.player1.pass();
                this.adoptedKin = this.player2.playAttachment('adopted-kin', this.mendicant);
                this.player1.pass();
                this.player2.clickCard(this.assa);
                this.player2.clickCard(this.mendicant);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.koku);
                this.player2.clickCard(this.koku);
                expect(this.player2).toHavePrompt('Tainted Koku');
                expect(this.player2).toBeAbleToSelect(this.initiate);
                this.player2.clickCard(this.initiate);
                expect(this.mendicant.location).toBe('dynasty discard pile');
                expect(this.adoptedKin.location).toBe('conflict discard pile');
                expect(this.koku.location).toBe('play area');
                expect(this.initiate.attachments.toArray()).toContain(this.koku);
            });
        });
    });
});
