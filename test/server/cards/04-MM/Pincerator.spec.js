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
            expect(this.troll.damage).toBe(1);
            expect(this.lamindra.damage).toBe(0);
            expect(this.alaka.damage).toBe(1);
            expect(this.flaxia.damage).toBe(1);
            expect(this.fuzzyGruen.damage).toBe(0);
            expect(this.ancientBear.damage).toBe(1);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.troll.damage).toBe(2);
            expect(this.lamindra.damage).toBe(0);
            expect(this.alaka.damage).toBe(2);
            expect(this.flaxia.damage).toBe(2);
            expect(this.fuzzyGruen.damage).toBe(0);
            expect(this.ancientBear.damage).toBe(2);
        });
    });
});
