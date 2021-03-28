describe('Interdimensional Graft', function () {
    describe("Interdimensional Graft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['interdimensional-graft']
                },
                player2: {
                    amber: 5,
                    hand: ['key-charge', 'hunting-witch', 'dust-pixie', 'ancient-bear'],
                    inPlay: ['snufflegator']
                }
            });
            this.player1.play(this.interdimensionalGraft);
        });

        it('should trigger on forging a key in the key phase', function () {
            this.player2.amber = 9;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(4);
        });

        it('should trigger on forging a key using a card ability', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(5);
            this.player2.clickPrompt('untamed');
            this.player2.play(this.huntingWitch);
            this.player2.play(this.dustPixie);
            this.player2.reap(this.snufflegator);
            expect(this.player2.amber).toBe(9);
            this.player2.play(this.keyCharge);
            expect(this.player2.amber).toBe(8);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger on subsequent turns', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.dustPixie);
            expect(this.player2.amber).toBe(7);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
        });
    });
});
