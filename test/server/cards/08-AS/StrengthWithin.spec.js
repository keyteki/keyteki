describe('Strength Within', function () {
    describe("Strength Within's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['strength-within']
                },
                player2: {
                    amber: 12,
                    inPlay: ['flaxia']
                }
            });
        });

        it('should do nothing if no damage on creature', function () {
            this.player1.playUpgrade(this.strengthWithin, this.troll);
            this.player1.endTurn();
            this.player2.forgeKey('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(6);
        });

        it('should increase key coast by damage on creature', function () {
            this.player1.playUpgrade(this.strengthWithin, this.troll);
            this.player1.fightWith(this.troll, this.flaxia);
            expect(this.troll.damage).toBe(4);
            this.player1.endTurn();
            this.player2.forgeKey('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(2);
        });
    });
});
