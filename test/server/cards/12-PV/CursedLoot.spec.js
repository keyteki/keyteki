describe('Cursed Loot', function () {
    describe("Cursed Loot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['cursed-loot']
                },
                player2: {
                    hand: ['krump', 'ancient-bear', 'ember-imp']
                }
            });
        });

        it('should discard a random card after playing a card', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.emberImp);

            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy itself if controller has no cards in hand', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.moveCard(this.krump, 'discard');
            this.player2.play(this.emberImp);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.cursedLoot.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
