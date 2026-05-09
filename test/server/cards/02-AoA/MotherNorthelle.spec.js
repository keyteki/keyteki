describe('Mother Northelle', function () {
    describe("Mother Northelle's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['mother-northelle', 'lady-maxena']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('moves 1A from a friendly creature with amber to the player pool', function () {
            this.ladyMaxena.amber = 2;
            this.troll.amber = 1;
            this.player1.reap(this.motherNorthelle);
            expect(this.player1).toBeAbleToSelect(this.ladyMaxena);
            expect(this.player1).not.toBeAbleToSelect(this.motherNorthelle);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.ladyMaxena);
            expect(this.ladyMaxena.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when no friendly creatures have amber', function () {
            this.player1.reap(this.motherNorthelle);
            expect(this.ladyMaxena.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
