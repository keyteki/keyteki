describe('Full Moon', function () {
    describe("Full Moon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['full-moon', 'ancient-bear', 'niffle-ape', 'dust-pixie', 'flaxia'],
                    inPlay: ['lamindra', 'urchin']
                },
                player2: {
                    inPlay: ['duskwitch']
                }
            });

            this.player1.play(this.fullMoon);
        });

        it('should gain 1 amber for each creature played', function () {
            this.player1.play(this.ancientBear);
            this.player1.play(this.niffleApe);
            this.player1.play(this.dustPixie);
            expect(this.player1.amber).toBe(5);
            this.player1.endTurn();
        });

        it("should trigger the same time as creature's play effect", function () {
            this.player1.play(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toHavePromptButton('Full Moon');
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });
    });
});
