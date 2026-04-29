describe('Crunch', function () {
    describe("Crunch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['hunting-witch', 'crunch', 'dust-pixie', 'troll']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should add power counters on reap', function () {
            this.player1.reap(this.crunch);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.crunch);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.huntingWitch);
            expect(this.crunch.power).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should add power counters on fight', function () {
            this.player1.fightWith(this.crunch, this.lamindra);
            this.player1.clickCard(this.dustPixie);
            expect(this.crunch.power).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
