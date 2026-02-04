describe('Bumblebird', function () {
    describe("Bumblebird's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['bumblebird'],
                    inPlay: ['dust-pixie', 'flaxia', 'batdrone']
                },
                player2: {
                    inPlay: ['niffle-ape']
                }
            });
        });

        it('should add 2 power counters to each other friendly Untamed creature on play', function () {
            this.player1.playCreature(this.bumblebird);
            expect(this.bumblebird.power).toBe(0);
            expect(this.dustPixie.power).toBe(2);
            expect(this.flaxia.power).toBe(2);
            expect(this.batdrone.power).toBe(0);
            expect(this.niffleApe.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
