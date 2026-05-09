describe('Mindworm', function () {
    describe("Mindworm's before fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['mindworm']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('makes the attacked creature deal damage equal to its power to each of its neighbors', function () {
            this.player1.fightWith(this.mindworm, this.krump);
            expect(this.mindworm.location).toBe('discard');
            expect(this.troll.damage).toBe(6);
            expect(this.krump.damage).toBe(1);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals damage only to the single neighbor when fighting a flank creature', function () {
            this.player1.fightWith(this.mindworm, this.troll);
            expect(this.mindworm.location).toBe('discard');
            expect(this.troll.damage).toBe(1);
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
