describe('Loyalty Implants', function () {
    describe("Loyalty Implants's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['clone-home'],
                    inPlay: ['flaxia', 'tunk', 'ironyx-rebel', 'loyalty-implants']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('allows using Mars creatures on an off-house turn', function () {
            this.player1.useAction(this.loyaltyImplants, true);
            expect(this.loyaltyImplants.location).toBe('discard');
            this.player1.reap(this.flaxia);
            this.player1.reap(this.ironyxRebel);
            this.player1.fightWith(this.tunk, this.dustPixie);
            expect(this.player1.amber).toBe(3);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not allow playing Mars cards on an off-house turn', function () {
            this.player1.useAction(this.loyaltyImplants, true);
            this.player1.clickCard(this.cloneHome);
            expect(this.cloneHome.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
