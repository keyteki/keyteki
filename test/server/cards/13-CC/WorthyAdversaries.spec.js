describe('Worthy Adversaries', function () {
    describe("Worthy Adversaries's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['worthy-adversaries'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['krump', 'flaxia', 'gub']
                }
            });
            // Pre-damage troll so we can test exalting already-damaged creatures
            this.troll.tokens.damage = 2;
        });

        it('should deal 1 damage to 2 different enemy creatures and exalt all damaged creatures in play', function () {
            this.player1.play(this.worthyAdversaries);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');
            // Damage checks
            expect(this.krump.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(2);
            // Exalt checks: all damaged creatures
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(1);
            expect(this.troll.tokens.amber).toBe(1);
            expect(this.gub.tokens.amber).toBeUndefined();
        });
    });
});
