describe('Ancient Yurk', function () {
    describe("Ancient Yurk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['ancient-yurk', 'dust-pixie', 'flaxia', 'niffle-ape']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should discard 3 cards from hand on play', function () {
            this.player1.play(this.ancientYurk);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);

            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.niffleApe);
            this.player1.clickPrompt('Done');

            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
