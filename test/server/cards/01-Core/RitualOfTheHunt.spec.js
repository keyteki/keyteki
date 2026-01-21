describe('Ritual of the Hunt', function () {
    describe("Ritual of the Hunt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['ritual-of-the-hunt', 'bulwark', 'urchin']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should allow using Untamed creatures after sacrifice', function () {
            this.player1.useAction(this.ritualOfTheHunt);
            expect(this.ritualOfTheHunt.location).toBe('discard');
            this.player1.reap(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not affect non-Untamed creatures', function () {
            this.player1.useAction(this.ritualOfTheHunt);
            this.player1.reap(this.bulwark);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
