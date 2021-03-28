describe('Auto-Encoder', function () {
    describe("Auto-Encoder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['shooler', 'redlock', 'mind-barb'],
                    inPlay: ['auto-encoder']
                },
                player2: {
                    amber: 5,
                    hand: ['mind-barb']
                }
            });
        });

        it('When a card is discarded, archive top card of deck', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');

            this.player2.play(this.player2.hand[0]);

            expect(this.player1.archives.length).toBe(1);
        });

        it('When a card is discarded using the menu buttons, archive top card of deck', function () {
            this.player1.clickCard(this.shooler);

            this.player1.clickPrompt('Discard this card');

            expect(this.player1.archives.length).toBe(1);
        });

        it('When opponent discards a card, do not archive anything', function () {
            this.player1.play(this.mindBarb);

            expect(this.player2.archives.length).toBe(0);
        });
    });
});
