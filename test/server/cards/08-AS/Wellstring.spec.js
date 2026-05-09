describe('Wellstring', function () {
    describe("Wellstring's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['wellstring', 'flaxia']
                },
                player2: {
                    inPlay: ['lamindra', 'troll']
                }
            });
        });

        it('deals damage on reap', function () {
            this.player1.reap(this.wellstring);
            expect(this.player1).toBeAbleToSelect(this.wellstring);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals damage on fight', function () {
            this.player1.fightWith(this.wellstring, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.wellstring);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
