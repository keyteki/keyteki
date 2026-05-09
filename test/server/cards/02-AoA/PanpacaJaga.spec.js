describe('Panpaca, Jaga', function () {
    describe("Panpaca, Jaga's persistent skirmish grant", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'urchin', 'panpaca-jaga', 'lamindra']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('gives skirmish only to friendly creatures to the left of Panpaca, Jaga', function () {
            expect(this.ancientBear.hasKeyword('skirmish')).toBe(true);
            expect(this.urchin.hasKeyword('skirmish')).toBe(true);
            expect(this.lamindra.hasKeyword('skirmish')).toBe(false);
            expect(this.krump.hasKeyword('skirmish')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets a left-side friendly creature avoid return damage when it fights', function () {
            this.player1.fightWith(this.ancientBear, this.krump);
            expect(this.ancientBear.damage).toBe(0);
            expect(this.krump.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
