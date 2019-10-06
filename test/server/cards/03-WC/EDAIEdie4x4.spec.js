describe('EDAI Edie 4x4', function() {
    integration(function() {
        describe('EDAI Edie 4x4\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['mother'],
                        hand: ['archimedes', 'edai-edie-4x4']
                    },
                    player2: {
                        amber: 4,
                        hand: ['urchin']
                    }
                });
            });

            it('should allow you to archive a card when played', function() {
                this.player1.play(this.edaiEdie4x4);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).not.toBeAbleToSelect(this.edaiEdie4x4);
                this.player1.clickCard(this.archimedes);
                expect(this.edaiEdie4x4.location).toBe('play area');
                expect(this.archimedes.location).toBe('archives');
                
            });
        });
        describe('EDAI Edie 4x4\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['edai-edie-4x4'],
                        archives: ['archimedes']
                    },
                    player2: {
                        amber: 6,
                        hand: []
                    }
                });
            });

            it('should increase the cost of opponent\'s keys by 1 for each archived card.', function() {
                this.player1.endTurn();
                expect(this.player2.player.amber).toBe(6);
                
            });
        });
    });
});
