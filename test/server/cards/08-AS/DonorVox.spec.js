describe('Donor Vox', function () {
    describe("Donor Vox's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['dr-xyloxxzlphrex', 'thunderdell'],
                    hand: ['donor-vox']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('lets you scrap it to give a friendly mars creature power counters', function () {
            this.player1.scrap(this.donorVox);
            expect(this.player1).toBeAbleToSelect(this.drXyloxxzlphrex);
            expect(this.player1).not.toBeAbleToSelect(this.thunderdell);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.drXyloxxzlphrex);
            expect(this.drXyloxxzlphrex.tokens.power).toBe(2);
        });
    });
});
