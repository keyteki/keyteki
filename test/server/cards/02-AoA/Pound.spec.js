describe('Pound', function () {
    describe("Pound's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['pound']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('deals 2 damage to a target with 1 splash damage to neighbors', function () {
            this.player1.play(this.pound);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.krump);
            expect(this.troll.damage).toBe(1);
            expect(this.krump.damage).toBe(2);
            expect(this.bumpsy.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('only splashes one neighbor when targeting a flank creature', function () {
            this.player1.play(this.pound);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.krump.damage).toBe(1);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
