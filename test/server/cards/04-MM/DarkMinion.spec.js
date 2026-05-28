describe('Dark Minion', function () {
    describe("Dark Minion's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dark-minion']
                },
                player2: {
                    inPlay: ['dodger', 'urchin', 'nexus']
                }
            });
        });

        it('deals 1D to each enemy creature when destroyed', function () {
            this.player1.fightWith(this.darkMinion, this.dodger);
            expect(this.darkMinion.location).toBe('discard');
            expect(this.dodger.damage).toBe(2);
            expect(this.urchin.location).toBe('discard');
            expect(this.nexus.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
