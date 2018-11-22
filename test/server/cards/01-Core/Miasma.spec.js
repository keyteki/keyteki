describe('Miasma', function() {
    integration(function() {
        describe('Miasma\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        amber: 5,
                        hand: ['miasma']
                    },
                    player2: {
                        amber: 7,
                        inPlay: ['snufflegator']
                    }
                });
                this.player1.play(this.miasma);
                this.player1.endTurn();
            });

            it('should skip the next turn\'s key phase', function() {
                expect(this.player1.amber).toBe(6);
                expect(this.player2.amber).toBe(7);
                expect(this.player2.player.keys).toBe(0);
            });

            it('should not skip the following turn key phase', function() {
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(7);
                expect(this.player2.player.keys).toBe(0);
                expect(this.player1.player.keys).toBe(1);
                this.player1.clickPrompt('shadows');
                this.player1.endTurn();
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                expect(this.player2.player.keys).toBe(1);
                expect(this.player1.player.keys).toBe(1);
            });
        });
    });
});
