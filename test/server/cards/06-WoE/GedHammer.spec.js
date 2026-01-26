describe('GedHammer', function () {
    describe("GedHammer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['ged-hammer', 'alaka', 'brammo']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump']
                }
            });
        });

        it('should ready and enrage other friendly bronar creatures on destroy', function () {
            this.player1.reap(this.alaka);
            this.player1.reap(this.brammo);
            this.krump.exhaust();

            expect(this.alaka.exhausted).toBe(true);
            expect(this.brammo.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);

            expect(this.alaka.enraged).toBe(false);
            expect(this.brammo.enraged).toBe(false);
            expect(this.krump.enraged).toBe(false);

            this.player1.fightWith(this.gedHammer, this.krump);
            expect(this.gedHammer.location).toBe('discard');

            expect(this.alaka.exhausted).toBe(false);
            expect(this.brammo.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
            expect(this.alaka.enraged).toBe(true);
            expect(this.brammo.enraged).toBe(true);
            expect(this.krump.enraged).toBe(false);

            this.player1.endTurn();
        });
    });
});
