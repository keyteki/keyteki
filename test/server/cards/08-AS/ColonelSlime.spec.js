describe('Colonel Slime', function () {
    describe("Colonel Slime's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['colonel-slime'],
                    inPlay: ['echofly', 'troll']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('capture 1 on a friendly creature on scrap', function () {
            this.player1.scrap(this.colonelSlime);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
