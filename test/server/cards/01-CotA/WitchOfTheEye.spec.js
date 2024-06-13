describe('Witch of the Eye', function () {
    describe("Witch of the Eye's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-bear', 'niffle-ape'],
                    inPlay: ['witch-of-the-eye']
                },
                player2: {
                    inPlay: ['inka-the-spider']
                }
            });
        });

        it('should return a card from discard to hand when it reaps', function () {
            this.player1.clickCard(this.wayOfTheBear);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickCard(this.niffleApe);
            this.player1.clickPrompt('Discard this card');
            expect(this.wayOfTheBear.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            this.player1.reap(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.wayOfTheBear);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.witchOfTheEye);
            this.player1.clickCard(this.wayOfTheBear);
            expect(this.wayOfTheBear.location).toBe('hand');
        });
    });
});
