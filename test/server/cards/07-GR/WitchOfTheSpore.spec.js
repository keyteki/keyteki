describe('Witch of the Spore', function () {
    describe("Witch of the Spore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['witch-of-the-spore'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.chains = 36;
        });

        it('deals damage to enemy creature when discarded', function () {
            this.player1.scrap(this.witchOfTheSpore);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing on discard with no enemy creatures', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.scrap(this.witchOfTheSpore);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
