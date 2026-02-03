describe('Old Yurk', function () {
    describe("Old Yurk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['old-yurk', 'dust-pixie', 'flaxia', 'niffle-ape']
                },
                player2: {
                    hand: ['batdrone']
                }
            });
        });

        it('should discard 2 cards from hand on play', function () {
            this.player1.play(this.oldYurk);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);

            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');

            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.niffleApe.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
