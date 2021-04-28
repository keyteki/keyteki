describe('Lion Bautrem', function () {
    describe("Lion Bautrem's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bigtwig', 'niffle-ape', 'lion-bautrem', 'witch-of-the-eye'],
                    hand: ['inka-the-spider']
                },
                player2: {
                    inPlay: ['brain-eater']
                }
            });
        });

        it('should give +2 power to its neighbors', function () {
            expect(this.bigtwig.power).toBe(7);
            expect(this.niffleApe.power).toBe(5);
            expect(this.lionBautrem.power).toBe(4);
            expect(this.witchOfTheEye.power).toBe(5);
            expect(this.brainEater.power).toBe(6);
        });
    });
});
