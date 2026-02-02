describe("Haedroth's Wall", function () {
    describe("Haedroth's Wall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['haedroth-s-wall', 'baron-mengevin'],
                    hand: ['bulwark', 'protectrix']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('should give +2 power to friendly flank creatures', function () {
            expect(this.baronMengevin.power).toBe(8);
            expect(this.batdrone.power).toBe(2);
            expect(this.dextre.power).toBe(3);

            this.player1.playCreature(this.bulwark);
            expect(this.baronMengevin.power).toBe(8);
            expect(this.bulwark.power).toBe(6);
            expect(this.batdrone.power).toBe(2);
            expect(this.dextre.power).toBe(3);

            this.player1.playCreature(this.protectrix);
            expect(this.baronMengevin.power).toBe(8);
            expect(this.bulwark.power).toBe(4);
            expect(this.protectrix.power).toBe(7);
            expect(this.batdrone.power).toBe(2);
            expect(this.dextre.power).toBe(3);
        });
    });
});
