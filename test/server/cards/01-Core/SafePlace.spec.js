describe('Safe Place', function() {
    integration(function() {
        describe('Safe Place\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 5,
                        house: 'shadows',
                        inPlay: ['safe-place', 'urchin'],
                        hand: ['ghostly-hand']
                    },
                    player2: {
                        amber: 4,
                        inPlay: ['troll']
                    }
                });
            });

            it('should place an amber on Safe Place when used', function() {
                this.player1.clickCard(this.safePlace);
                expect(this.player1).toHavePrompt('Safe Place');
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1.amber).toBe(4);
                expect(this.safePlace.tokens.amber).toBe(1);
            });

            it('should use amber on Safe Place when necessary to forge a key', function() {
                this.player1.clickCard(this.safePlace);
                this.player1.clickPrompt('Use this card\'s Action ability');
                this.player1.reap(this.urchin);
                expect(this.player1.amber).toBe(5);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('1');
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(0);
                expect(this.safePlace.hasToken('amber')).toBe(false);
                expect(this.player1.player.keys.red).toBe(true);
                expect(this.player1.player.keys.blue).toBe(false);
                expect(this.player1.player.keys.yellow).toBe(false);
            });
        });
    });
});
