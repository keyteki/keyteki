describe('Myliobe', function () {
    describe('Myliobe constant ability and fight abilites', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['myliobe']
                },
                player2: {
                    inPlay: ['nexus', 'brammo', 'mugwump', 'dust-pixie']
                }
            });
        });

        it('has skirmish if tide is high', function () {
            expect(this.myliobe.getKeywordValue('skirmish')).toBe(0);
            this.player1.raiseTide();
            expect(this.myliobe.getKeywordValue('skirmish')).toBe(1);
        });

        it('before fight enrages neighbors of creatures it fights', function () {
            this.player1.fightWith(this.myliobe, this.brammo);
            expect(this.nexus.enraged).toBe(true);
            expect(this.brammo.enraged).toBe(true);
            expect(this.mugwump.enraged).toBe(true);
            expect(this.dustPixie.enraged).toBe(false);
        });
    });
});
