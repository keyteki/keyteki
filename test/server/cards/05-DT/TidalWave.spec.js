describe('Tidal Wave', function () {
    describe("Tidal Wave's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['tidal-wave'],
                    inPlay: ['kaupe']
                },
                player2: {
                    inPlay: ['bloodshard-imp', 'bulwark', 'alaka', 'groke']
                }
            });
        });

        it('should not destroy anything if the tide is not high', function () {
            this.player1.play(this.tidalWave);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2.isTideHigh()).toBe(true);
        });
        it('should destroy a creature and its neighbors then raise the opponents tide', function () {
            this.player1.raiseTide();
            this.player1.play(this.tidalWave);

            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.groke);
            this.player1.clickCard(this.alaka);

            expect(this.bloodshardImp.location).toBe('play area');

            expect(this.bulwark.location).toBe('discard');
            expect(this.alaka.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.player2.isTideHigh()).toBe(true);
        });
    });
});
