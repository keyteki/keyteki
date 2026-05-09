describe('Doze Wing', function () {
    describe("Doze Wing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['doze-wing'],
                    inPlay: ['caspart']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('exhausts each non-Dragon creature', function () {
            this.player1.play(this.dozeWing);
            expect(this.caspart.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
