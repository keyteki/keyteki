describe('Restoration of Balance', function() {
    integration(function() {
        describe('Restoration of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: [
                            'against-the-waves', 'fine-katana', 'ornate-fan', 'honored-blade',
                            'magnificent-kimono', 'assassination', 'banzai', 'charge'
                        ]
                    },
                    player2: {
                        provinces: ['restoration-of-balance']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            });

            it('should trigger when attackers are declared', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('restoration-of-balance');
            });

            it('should prompt the opponent to discard down to four cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker']
                });
                this.player2.clickCard('restoration-of-balance');
                expect(this.player1).toHavePrompt('Choose 4 cards to discard');
                expect(this.player1).toBeAbleToSelect('assassination');
                expect(this.player1).toBeAbleToSelect('charge');
            });

            it('should discard the chosen cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker']
                });
                this.player2.clickCard('restoration-of-balance');
                this.assassination = this.player1.clickCard('assassination');
                this.fineKatana = this.player1.clickCard('fine-katana');
                this.charge = this.player1.clickCard('charge');
                this.banzai = this.player1.clickCard('banzai');
                this.player1.clickPrompt('Done');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.assassination, this.fineKatana, this.charge, this.banzai);
            });
        });
    });
});
