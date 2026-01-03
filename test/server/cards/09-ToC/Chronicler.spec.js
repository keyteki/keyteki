describe('Chronicler', function () {
    describe("Chronicler's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'chronicler',
                    inPlay: ['chronicler:gub', 'helper-bot']
                },
                player2: {
                    amber: 1
                }
            });

            this.chronicler = this.player1.player.creaturesInPlay[0];
            this.p1deck = this.player1.player.deck[0];
        });

        it('should archive the top card of the deck on reap', function () {
            this.player1.reap(this.chronicler);
            expect(this.p1deck.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
