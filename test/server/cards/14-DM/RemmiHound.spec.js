describe('Remmi Hound', function () {
    describe('Remmi Hound while exhausted', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['bosun-creen', 'troll', 'remmi-hound']
                },
                player2: {}
            });
        });

        it('grants +4 power to friendly flank creatures', function () {
            this.player1.reap(this.remmiHound);
            // bosun-creen 3p + 4 = 7
            expect(this.bosunCreen.power).toBe(7);
            // remmi-hound 3p + 4 = 7
            expect(this.remmiHound.power).toBe(7);
            // troll center, 8p, no buff
            expect(this.troll.power).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Remmi Hound while ready', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['bosun-creen', 'troll', 'remmi-hound']
                },
                player2: {}
            });
        });

        it('does not grant power', function () {
            expect(this.remmiHound.exhausted).toBe(false);
            expect(this.bosunCreen.power).toBe(3);
            expect(this.remmiHound.power).toBe(3);
            expect(this.troll.power).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
