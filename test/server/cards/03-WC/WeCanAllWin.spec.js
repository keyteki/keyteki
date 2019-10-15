describe('We Can All Win', function() {
    integration(function() {
        describe('We Can All Win\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 8,
                        house: 'staralliance',
                        hand: ['we-can-all-win', 'pitlord', 'arise', 'dextre', 'doc-bookton'],
                        discard: ['tocsin', 'batdrone']
                    },
                    player2: {
                        amber: 8,
                        hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                        discard: ['flaxia', 'nexus']
                    }
                });
            });

            it('should reduce the key cost by -2 until the end of the following turn', function() {
                this.player1.play(this.weCanAllWin);
                expect(this.weCanAllWin.location).toBe('discard');
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                expect(this.player2.amber).toBe(4);
                expect(this.player2.player.keys).toBe(1);
                this.player2.endTurn();
                this.player1.clickPrompt('staralliance');
                expect(this.player1.amber).toBe(5);
                expect(this.player1.player.keys).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                expect(this.player2.amber).toBe(4);
                expect(this.player2.player.keys).toBe(1);
            });
        });
    });
});
