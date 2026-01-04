describe('Island of Misfit Toys', function () {
    describe("Island of Misfit Toys's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['island-of-misfit-toys'],
                    discard: ['charette', 'a-strong-feeling', 'sinder', 'echofly']
                }
            });
        });

        it('returns each discarded Geistoid card to hand and purges itself', function () {
            this.player1.useAction(this.islandOfMisfitToys);
            expect(this.charette.location).toBe('discard');
            expect(this.sinder.location).toBe('discard');
            expect(this.aStrongFeeling.location).toBe('hand');
            expect(this.echofly.location).toBe('hand');
            expect(this.islandOfMisfitToys.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
