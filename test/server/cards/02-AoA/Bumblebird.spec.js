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
            expect(this.bumblebird.tokens.power).toBeUndefined();
            expect(this.dustPixie.tokens.power).toBe(2);
            expect(this.flaxia.tokens.power).toBe(2);
            expect(this.batdrone.tokens.power).toBeUndefined();
            expect(this.niffleApe.tokens.power).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
