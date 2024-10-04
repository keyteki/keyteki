describe('Haunting Deck', function () {
    describe("Haunting Deck's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-deck', 'a-strong-feeling'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    discard: ['hunting-witch', 'helper-bot']
                }
            });
            this.player1.chains = 36;
        });

        it('does nothing if not haunted', function () {
            this.player1.play(this.hauntingDeck);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.player.purged.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(10);
            expect(this.player2.player.purged.length).toBe(0);
        });

        it('purges an enemy discard card if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.hauntingDeck);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.player1.player.discard[1]);
            expect(this.player1).toBeAbleToSelect(this.player1.player.discard[9]);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('purged');
            expect(this.player1.player.purged.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(11);
            expect(this.player2.player.purged.length).toBe(1);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
