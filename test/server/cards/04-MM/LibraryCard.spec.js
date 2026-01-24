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
            this.player1.clickCard(this.dextre);
            expect(this.player1.hand.length).toBe(2);

            this.player1.play(this.krrrzzzaaap);
            this.player1.clickPrompt('library card');
            expect(this.player1.hand.length).toBe(2);
        });
    });

    describe("Library Card's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['labwork'],
                    inPlay: ['keyfrog', 'professor-terato', 'library-card']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow ordering of triggers when playing labwork as the last card in hand', function () {
            this.player1.moveCard(this.keyfrog, 'deck');
            this.player1.useAction(this.libraryCard);
            this.player1.play(this.labwork);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1.currentPrompt().buttons[0].values.card).toBe('Library Card');
            expect(this.player1.currentPrompt().buttons[1].values.card).toBe('Labwork');
            expect(this.player1.currentPrompt().buttons[2].text).toBe('Autoresolve');
            this.player1.clickPrompt('Library Card');
            expect(this.player1).toHavePrompt('Labwork');
            expect(this.keyfrog.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            this.player1.clickCard(this.keyfrog);
            expect(this.keyfrog.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
