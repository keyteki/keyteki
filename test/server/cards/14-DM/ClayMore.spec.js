describe('Clay More', function () {
    describe("Clay More's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['clay-more', 'urchin', 'silvertooth']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('deals 2 damage to each enemy flank creature when destroyed and does not damage friendly creatures', function () {
            this.player1.fightWith(this.clayMore, this.troll);
            expect(this.clayMore.location).toBe('discard');
            expect(this.urchin.damage).toBe(0);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.troll.damage).toBe(3);
            expect(this.bumpsy.damage).toBe(2);
            expect(this.krump.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
