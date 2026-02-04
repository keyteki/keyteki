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
            expect(this.bumblebird.powerCounters).toBe(0);
            expect(this.dustPixie.powerCounters).toBe(2);
            expect(this.flaxia.powerCounters).toBe(2);
            expect(this.batdrone.powerCounters).toBe(0);
            expect(this.niffleApe.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
