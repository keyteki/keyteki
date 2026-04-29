describe('Searine', function () {
    describe("Searine's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['searine'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('deals damage to friendly creature when discarded', function () {
            this.player1.scrap(this.searine);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing on discard with no friendly creatures', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.scrap(this.searine);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
