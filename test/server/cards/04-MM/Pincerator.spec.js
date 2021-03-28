describe('Pincerator', function () {
    describe("Pincerator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['pincerator', 'troll', 'lamindra', 'alaka']
                },
                player2: {
                    inPlay: ['flaxia', 'fuzzy-gruen', 'ancient-bear']
                }
            });
        });

        it('should deal 1D to flank creatures at end of p1 and p2 turn', function () {
            this.player1.endTurn();
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.alaka.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.fuzzyGruen.tokens.damage).toBeUndefined();
            expect(this.ancientBear.tokens.damage).toBe(1);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.fuzzyGruen.tokens.damage).toBeUndefined();
            expect(this.ancientBear.tokens.damage).toBe(2);
        });
    });
});
