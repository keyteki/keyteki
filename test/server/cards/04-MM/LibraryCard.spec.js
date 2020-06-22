describe('Library Card', function () {
    describe("Library Card's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['krrrzzzaaap', 'dextre'],
                    inPlay: ['keyfrog', 'professor-terato', 'library-card']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should purge library card and then draw a card for every card played', function () {
            this.player1.useAction(this.libraryCard);

            expect(this.libraryCard.location).toBe('purged');

            this.player1.play(this.dextre);
            expect(this.player1.hand.length).toBe(2);

            this.player1.play(this.krrrzzzaaap);
            this.player1.clickPrompt('library card');
            expect(this.player1.hand.length).toBe(2);
        });
    });
});
