describe('Bilgum Avalanche', function () {
    describe("Bilgum Avalanche's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 14,
                    house: 'untamed',
                    hand: ['key-charge', 'chota-hazri'],
                    inPlay: ['bilgum-avalanche', 'snufflegator'],
                    forgedKeys: 0
                },
                player2: {
                    amber: 6,
                    inPlay: ['mother', 'troll']
                }
            });
        });

        it('should deal 2 damage to all enemy creatures when forging a key', function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.mother.damage).toBe(2);
            expect(this.troll.damage).toBe(2);
        });

        it('should not affect friendly creatures', function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.bilgumAvalanche.damage).toBe(0);
            expect(this.snufflegator.damage).toBe(0);
        });

        it('should not trigger when opponent forges a key', function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.mother.damage).toBe(0);
            expect(this.troll.damage).toBe(0);
        });

        it('should trigger for each key forged in the same turn', function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.mother.damage).toBe(2);
            this.player1.play(this.chotaHazri);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('blue');
            expect(this.mother.damage).toBe(4);
        });
    });
});
