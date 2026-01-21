describe('Random Access Archives', function () {
    describe("Random Access Archives's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['random-access-archives']
                },
                player2: {}
            });
        });

        it('should archive the top card of the deck when played', function () {
            let topCard = this.player1.deck[0];
            this.player1.play(this.randomAccessArchives);
            expect(this.player1.archives).toContain(topCard);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
