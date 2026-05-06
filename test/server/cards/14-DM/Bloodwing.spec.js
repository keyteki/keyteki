describe('Bloodwing', function () {
    describe("Bloodwing's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['bosun-creen', 'flip-stallard', 'bloodwing']
                },
                player2: {}
            });
        });

        it('puts a +1 power counter on each friendly flank creature on reap', function () {
            this.player1.reap(this.bloodwing);
            // Battleline: bosun-creen (left flank), flip-stallard (center), bloodwing (right flank)
            expect(this.bosunCreen.powerCounters).toBe(1);
            expect(this.flipStallard.powerCounters).toBe(0);
            expect(this.bloodwing.powerCounters).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Bloodwing's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['bosun-creen', 'flip-stallard', 'bloodwing']
                },
                player2: {
                    inPlay: ['bad-penny']
                }
            });
        });

        it('puts a +1 power counter on each friendly flank creature on fight', function () {
            this.player1.fightWith(this.bloodwing, this.badPenny);
            expect(this.bosunCreen.powerCounters).toBe(1);
            expect(this.flipStallard.powerCounters).toBe(0);
            expect(this.bloodwing.powerCounters).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
