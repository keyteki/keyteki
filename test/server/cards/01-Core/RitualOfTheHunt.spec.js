describe('Ritual of the Hunt', function () {
    describe("Ritual of the Hunt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['ritual-of-the-hunt', 'protectrix', 'flaxia', 'urchin']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should allow using Untamed creatures after sacrifice', function () {
            this.player1.useOmni(this.ritualOfTheHunt);
            expect(this.ritualOfTheHunt.location).toBe('discard');
            this.player1.reap(this.flaxia);
            this.player1.reap(this.protectrix);
            expect(this.player1.amber).toBe(2);
            this.player1.clickCard(this.urchin);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
