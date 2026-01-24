describe('Punch', function () {
    describe("Punch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch'],
                    inPlay: ['bumpsy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should deal 3 damage to a creature', function () {
            this.player1.play(this.punch);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to target friendly creatures', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
