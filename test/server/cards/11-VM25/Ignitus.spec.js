describe('Ignitus', function () {
    describe("Ignitus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ignitus', 'troll', 'brammo']
                },
                player2: {
                    inPlay: ['charette', 'ember-imp']
                }
            });
        });

        it('should have splash-attack 0 when no creatures are exhausted', function () {
            expect(this.ignitus.getKeywordValue('splash-attack')).toBe(0);
        });

        it('should have splash-attack 2 when one creature is exhausted and it fights', function () {
            this.troll.exhausted = true;
            this.player1.fightWith(this.ignitus, this.emberImp);
            expect(this.charette.damage).toBe(2);
        });

        it('should have splash-attack 3 when two creatures are exhausted and it fights', function () {
            this.troll.exhausted = true;
            this.charette.exhausted = true;
            this.player1.fightWith(this.ignitus, this.emberImp);
            expect(this.charette.damage).toBe(3);
        });

        it('should have splash-attack 4 when three creatures are exhausted and it fights', function () {
            this.troll.exhausted = true;
            this.charette.exhausted = true;
            this.emberImp.exhausted = true;
            this.player1.fightWith(this.ignitus, this.emberImp);
            expect(this.charette.location).toBe('discard');
        });
    });
});
