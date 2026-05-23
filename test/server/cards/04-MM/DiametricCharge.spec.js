describe('Diametric Charge', function () {
    describe("Diametric Charge's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['diametric-charge']
                },
                player2: {
                    inPlay: ['troll', 'urchin', 'lamindra']
                }
            });
        });

        it('deals 1D to a target and 2D splash to neighbors', function () {
            this.player1.play(this.diametricCharge);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.damage).toBe(2);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
