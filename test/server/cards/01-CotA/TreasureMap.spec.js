describe('Treasure Map', function () {
    describe("Treasure Map's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['treasure-map', 'bait-and-switch', 'miasma']
                },
                player2: {
                    amber: 2,
                    inPlay: []
                }
            });
        });

        it('should make the player gain 3 amber if no actions have been played, and prevent further actions', function () {
            this.player1.play(this.treasureMap);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.miasma);
            expect(this.player1).toHavePrompt('Miasma');
            expect(this.player1).not.toHavePromptButton('Play this action');
        });

        it('should not make the player gain 3 amber if actions have been played, and prevent further actions', function () {
            this.player1.play(this.baitAndSwitch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.player1.play(this.treasureMap);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.miasma);
            expect(this.player1).toHavePrompt('Miasma');
            expect(this.player1).not.toHavePromptButton('Play this action');
        });
    });
});
