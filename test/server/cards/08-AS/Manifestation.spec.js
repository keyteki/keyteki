describe('Manifestation', function () {
    describe("Manifestation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['manifestation', 'a-strong-feeling'],
                    inPlay: ['echofly'],
                    discard: new Array(8).fill('poke').concat(['dust-pixie']) // not yet haunted
                },
                player2: {
                    amber: 2,
                    inPlay: ['helper-bot'],
                    discard: new Array(8).fill('poke').concat(['control-the-weak']) // not yet haunted
                }
            });

            this.controlTheWeak.enhancements = ['capture'];
        });

        it('does nothing if no one is haunted', function () {
            this.player1.play(this.manifestation);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('resolves amber bonus icons of a card in a haunted discard pile', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player2.moveCard(this.helperBot, 'discard');
            this.player1.play(this.manifestation);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.controlTheWeak);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('resolves other bonus icons of a card in a haunted discard pile', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player2.moveCard(this.helperBot, 'discard');
            this.player1.play(this.manifestation);
            this.player1.clickCard(this.controlTheWeak);
            this.player1.clickCard(this.echofly);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.echofly.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
