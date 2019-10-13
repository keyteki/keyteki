describe('Vineapple Tree', function() {
    integration(function() {
        describe('Vineapple Tree Functionality', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 5,
                        house: 'untamed',
                        inPlay: ['vineapple-tree'],
                        hand: ['fertility-chant']
                    },
                    player2: {
                        amber: 6,
                        hand: ['ghostly-hand', 'nexus']
                    }
                });
            });
            it('should place a growth counter on itself when used', function() {
                this.player1.clickCard(this.vineappleTree);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.vineappleTree.tokens.growth).toBe(1);
            });
            it('should increase key cost by 1A for every growth counter on it', function() {
                this.player1.clickCard(this.vineappleTree);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.vineappleTree.tokens.growth).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                expect(this.player2.player.keys).toBe(0);
                expect(this.player2.amber).toBe(6);
                this.player2.play(this.ghostlyHand);
                expect(this.player2.amber).toBe(8);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.clickCard(this.vineappleTree);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.vineappleTree.tokens.growth).toBe(2);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                expect(this.player2.player.keys).toBe(1);
                expect(this.player2.amber).toBe(0);
                expect(this.vineappleTree.tokens.growth).toBe(undefined);
            });
        });
    });
});
