describe('Grey Aberrant', function () {
    describe("Grey Aberrant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    hand: ['grey-aberrant'],
                    inPlay: ['raiding-knight'],
                    discard: ['chonkers']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should cause each creature to lose their traits', function () {
            expect(this.raidingKnight.getTraits().length).toBe(2);
            expect(this.greyAberrant.getTraits().length).toBe(2);
            expect(this.lamindra.getTraits().length).toBe(2);
            expect(this.chonkers.getTraits().length).toBe(1);
            expect(this.greyAberrant.hasTrait('mutant')).toBe(true);
            this.player1.playCreature(this.greyAberrant);
            expect(this.raidingKnight.getTraits().length).toBe(0);
            expect(this.greyAberrant.getTraits().length).toBe(0);
            expect(this.lamindra.getTraits().length).toBe(0);
            expect(this.chonkers.getTraits().length).toBe(1);
            expect(this.greyAberrant.hasTrait('mutant')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
