describe('Phylyx the Disintegrator', function () {
    describe("Phylyx the Disintegrator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['phylyx-the-disintegrator', 'zorg', 'tunk', 'dodger']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mindwarper', 'troll']
                }
            });
        });

        it('should make opponent lose 1 amber per other friendly Mars creature', function () {
            this.player1.clickCard(this.phylyxTheDisintegrator);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose no amber if no other Mars creatures', function () {
            this.player1.moveCard(this.zorg, 'discard');
            this.player1.moveCard(this.tunk, 'discard');
            this.player2.moveCard(this.mindwarper, 'discard');
            this.player1.clickCard(this.phylyxTheDisintegrator);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
