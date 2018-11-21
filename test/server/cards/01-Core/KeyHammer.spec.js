describe('Key Hammer', function() {
    integration(function() {
        describe('Key Hammer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        hand: ['key-hammer', 'urchin']
                    },
                    player2: {
                        amber: 6,
                        hand: ['snufflegator']
                    }
                });
            });

            it('should unforge a key when one was forged', function() {
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(1);
                expect(this.player2.amber).toBe(0);
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('dis');
                this.player1.play(this.keyHammer);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.player.keys).toBe(0);
                expect(this.player2.amber).toBe(6);
            });

            it('should not unforge a key when one was not forged', function() {
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(1);
                expect(this.player2.amber).toBe(0);
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('dis');
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('dis');
                this.player1.play(this.keyHammer);
                expect(this.player2.player.keys).toBe(1);
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});