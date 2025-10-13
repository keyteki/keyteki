describe('Miasma', function () {
    describe("Miasma's ability", function () {
        beforeEach(function () {
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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'shadows',
                    hand: ['miasma'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'shadows';
            this.tachyonManifold.printedHouse = 'shadows';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.miasma);
            this.player1.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.amber).toBe(6);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
