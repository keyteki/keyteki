describe('Yurk', function () {
    describe("Yurk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['yurk', 'dust-pixie', 'flaxia']
                },
                player2: {
                    hand: ['batdrone']
                }
            });
        });

        it('should discard 1 card from hand on play', function () {
            this.player1.play(this.yurk);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);

            this.player1.clickCard(this.dustPixie);

            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
