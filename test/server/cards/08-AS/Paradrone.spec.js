describe('Paradrone', function () {
    describe("Paradrone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['paradrone', 'troll']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('capture 1 on a friendly creature on fight', function () {
            this.player1.fightWith(this.paradrone, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.paradrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
