describe('Knoxx', function () {
    describe("Knoxx's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['knoxx']
                },
                player2: {}
            });
        });

        it('should have base power when on flank with no neighbors', function () {
            expect(this.knoxx.power).toBe(5);
        });

        it('should get +3 power for each neighbor', function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['tunk', 'knoxx']
                },
                player2: {}
            });

            expect(this.knoxx.power).toBe(8);
        });

        it('should get +6 power with two neighbors', function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['tunk', 'knoxx', 'troll']
                },
                player2: {}
            });

            expect(this.knoxx.power).toBe(11);
        });
    });
});
