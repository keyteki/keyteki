describe('Niffle Queen', function () {
    describe("Niffle Queen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bigtwig', 'niffle-ape', 'niffle-queen', 'witch-of-the-eye'],
                    hand: ['inka-the-spider']
                },
                player2: {
                    inPlay: ['brain-eater']
                }
            });
        });

        it('should give +1 power to beast and extra +1 to niffle friendly creatures other than the Queen', function () {
            expect(this.niffleQueen.power).toBe(6);
            expect(this.bigtwig.power).toBe(8);
            expect(this.niffleApe.power).toBe(5);
            expect(this.witchOfTheEye.power).toBe(3);
            expect(this.brainEater.power).toBe(6);
        });
    });
});
