describe('Miasma Bomb', function () {
    describe("Miasma Bomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 6,
                    inPlay: ['miasma-bomb']
                },
                player2: {
                    amber: 7,
                    inPlay: ['snufflegator']
                }
            });

            this.player1.useAction(this.miasmaBomb);
            expect(this.miasmaBomb.location).toBe('discard');
            this.player1.endTurn();
        });

        it("should skip the next turn's key phase", function () {
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(7);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
        });

        it('should not skip the following turn key phase', function () {
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(7);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
        });
    });
});
