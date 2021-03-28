describe('Imperial Forge', function () {
    describe("Imperial Forge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 14,
                    inPlay: ['lamindra', 'redlock', 'urchin'],
                    hand: ['imperial-forge']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should forge a key at +8 cost', function () {
            this.player1.play(this.imperialForge);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(1);
        });

        it('should forge a key at 4 cost, +8 reduced by 10 (ambers on friendly creatures)', function () {
            this.lamindra.tokens.amber = 6;
            this.redlock.tokens.amber = 4;
            this.troll.tokens.amber = 3;

            this.player1.play(this.imperialForge);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(11);
        });

        it('should forge a key at 0 cost, +8 reduced by 20 (ambers on friendly creatures)', function () {
            this.lamindra.tokens.amber = 7;
            this.redlock.tokens.amber = 13;
            this.troll.tokens.amber = 3;

            this.player1.play(this.imperialForge);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(15);
        });
    });
});
