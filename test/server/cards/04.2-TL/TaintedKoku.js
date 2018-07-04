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
                        hand: ['tainted-koku','assassinate']
                    }
                });
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.mendicant = this.player1.findCardByName('togashi-mendicant');

                this.koku = this.player2.findCardByName('tainted-koku');
                this.shoju = this.player2.findCardByName('bayushi-shoju');
                this.assa = this.player2.findCardByName('assassinate');

            });

            it('should correctly be discarded by Let go ', function() {
                this.noMoreActions();
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.player1.clickCard(this.letgo);
                this.player1.clickCard(this.mendicant);
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
                expect(this.mendicant.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.player2).toBeAbleToSelect(this.koku);
                this.player2.clickCard(this.koku);
                expect(this.player2).toBeAbleToSelect(this.initiate);
                this.player2.clickCard(this.initiate);
                expect(this.initiate.attachments.toArray()).toContain(this.koku);
            });

            it('should go back to hand if ancestral and only attached character left leaves play ', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mendicant],
                    defenders: [this.shoju],
                    type: 'political'
                });
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.koku.addKeyword('ancestral');
                this.player1.pass();
                this.Player2.clickCard('assa');
                this.Player2.clickCard('this.initiate');
                expect(this.initiate.location).toBe('dynasty discard pile');
                this.player1.pass();
                this.player2.clickCard(this.shoju);
                this.player2.clickCard(this.mendicant);
                expect(this.mendicant.location).toBe('dynasty discard pile');
                expect(this.player2.player.hand).toContain(this.koku);
            });
        });
    });
});
