describe('Interdimensional Graft', function () {
    describe("Interdimensional Graft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['interdimensional-graft'],
                    inPlay: ['dextre']
                },
                player2: {
                    amber: 5,
                    hand: ['key-charge', 'hunting-witch', 'dust-pixie', 'ancient-bear'],
                    inPlay: ['snufflegator', 'keyfrog']
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

        it('should not trigger on forging a key in the same round it was played', function () {
            this.player2.amber = 9;
            this.player1.fightWith(this.dextre, this.keyfrog);
            this.player1.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
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

        it('should trigger multiple times on forging a key', function () {
            expect(this.player1.amber).toBe(1);
            this.player2.amber = 15;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(10);
            this.player2.clickPrompt('untamed');
            this.player2.amber = 12;
            this.player2.play(this.keyCharge);
            expect(this.player2.amber).toBe(11);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('Blue');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(true);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(15);
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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'logos',
                    hand: ['interdimensional-graft'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 9,
                    inPlay: ['ember-imp'],
                    hand: ['necromorph', 'azuretooth', 'shaffles']
                }
            });
            this.tachyonManifold.printedHouse = 'logos';
            this.tachyonManifold.maverick = 'logos';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.interdimensionalGraft);
            this.player1.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('dis');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
