describe('Witch of the Dawn', function () {
    describe("Witch of the Dawn's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-bear', 'niffle-ape', 'regrowth', 'witch-of-the-dawn']
                },
                player2: {
                    inPlay: ['inka-the-spider']
                }
            });
        });

        it('should return a creature card from discard to hand when played', function () {
            this.player1.clickCard(this.wayOfTheBear);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickCard(this.niffleApe);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickCard(this.regrowth);
            this.player1.clickPrompt('Discard this card');

            expect(this.wayOfTheBear.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.regrowth.location).toBe('discard');

            this.player1.play(this.witchOfTheDawn);
            expect(this.player1).not.toBeAbleToSelect(this.wayOfTheBear);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.regrowth);
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
        });
    });
});
