describe('Public Theft', function () {
    describe("Public Theft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['public-theft'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'lamindra']
                }
            });

            this.gub.amber = 2;
            this.lamindra.amber = 1;
            this.lamindra.enrage();
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.publicTheft);
            });

            it('should be able to select enemy creature', function () {
                expect(this.player1).toBeAbleToSelect(this.gub);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.krump);
                expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            });

            it('should be able to select a non-enraged no-amber enemy creature', function () {
                this.player1.clickCard(this.krump);
                expect(this.krump.enraged).toBe(true);
                expect(this.krump.amber).toBe(0);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(1);
            });

            it('should be able to select a non-enraged amber enemy creature', function () {
                this.player1.clickCard(this.gub);
                expect(this.gub.enraged).toBe(true);
                expect(this.gub.amber).toBe(0);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(1);
            });

            it('should be able to select an enraged amber enemy creature', function () {
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.enraged).toBe(true);
                expect(this.lamindra.amber).toBe(0);
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
            });
        });
    });
});
