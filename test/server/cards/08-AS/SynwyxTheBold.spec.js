describe('Synwyx The Bold', function () {
    describe("Synwyx The Bold's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['synwyx-the-bold']
                },
                player2: {
                    amber: 3,
                    inPlay: ['cpo-zytar', 'alien-horror']
                }
            });
        });

        it('makes an enemy creature capture 2 from its own side', function () {
            this.player1.fightWith(this.synwyxTheBold, this.alienHorror);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player2.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(2);
        });
    });
});
