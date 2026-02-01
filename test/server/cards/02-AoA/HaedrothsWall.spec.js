describe("Haedroth's Wall", function () {
    describe("Haedroth's Wall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['haedroth-s-wall', 'ember-imp', 'shooler', 'pit-demon']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('should give +2 power to friendly flank creatures', function () {
            expect(this.emberImp.power).toBe(4);
            expect(this.shooler.power).toBe(2);
            expect(this.pitDemon.power).toBe(4);

            expect(this.batdrone.power).toBe(1);
            expect(this.dextre.power).toBe(1);
        });
    });
});
