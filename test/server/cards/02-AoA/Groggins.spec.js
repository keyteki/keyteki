describe('Groggins', function () {
    describe("Groggins's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['groggins'],
                    hand: ['inka-the-spider']
                },
                player2: {
                    inPlay: ['bigtwig', 'niffle-ape', 'lion-bautrem', 'witch-of-the-eye']
                }
            });
        });

        it('should only be able to fight flank creatures', function () {
            this.player1.clickCard(this.groggins);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.bigtwig);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.lionBautrem);
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
        });
    });
});
