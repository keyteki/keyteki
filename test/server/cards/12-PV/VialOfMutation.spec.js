describe('Vial of Mutation', function () {
    describe("Vial of Mutation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['vial-of-mutation'],
                    inPlay: ['ember-imp', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['ancient-bear', 'fandangle']
                }
            });
        });

        it('should put a mutation counter on 2 creatures and make them gain the Mutant trait', function () {
            this.player1.play(this.vialOfMutation);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.fandangle);

            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('Done');

            expect(this.emberImp.tokens.mutation).toBe(1);
            expect(this.ancientBear.tokens.mutation).toBe(1);
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.ancientBear.hasTrait('mutant')).toBe(true);
            expect(this.krump.hasTrait('mutant')).toBe(false);
            expect(this.troll.hasTrait('mutant')).toBe(false);
            expect(this.fandangle.hasTrait('mutant')).toBe(true);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should remove the Mutant trait when the mutation counter is removed', function () {
            this.player1.play(this.vialOfMutation);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');

            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.troll.hasTrait('mutant')).toBe(true);

            this.player1.moveCard(this.emberImp, 'discard');
            expect(this.emberImp.hasTrait('mutant')).toBe(false);
            expect(this.troll.hasTrait('mutant')).toBe(true);
        });
    });
});
