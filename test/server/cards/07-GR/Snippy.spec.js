describe('Snippy', function () {
    describe("Snippy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['snippy'],
                    inPlay: ['charette']
                },
                player2: {
                    inPlay: ['thing-from-the-deep', 'dew-faerie', 'flaxia']
                }
            });
        });

        it('does 2 damage to a creature on play', function () {
            this.player1.playCreature(this.snippy);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.snippy);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys an enemy flank creature on scrap', function () {
            this.player1.scrap(this.snippy);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.location).toBe('discard');
            expect(this.snippy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
