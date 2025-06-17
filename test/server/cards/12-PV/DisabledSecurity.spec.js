describe('Disabled Security', function () {
    describe("Disabled Security's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['disabled-security'],
                    inPlay: ['umbra']
                },
                player2: {
                    amber: 4,
                    discard: ['urchin', 'hunting-witch', 'krump', 'dust-pixie']
                }
            });

            this.player2.moveCard(this.urchin, 'deck');
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player2.moveCard(this.krump, 'deck');
        });

        it("should play a card from opponent's discarded cards", function () {
            this.player1.play(this.disabledSecurity);
            expect(this.urchin.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.location).toBe('play area');
            expect(this.krump.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not play a card if opponent has no cards in deck', function () {
            this.player2.player.deck = [];
            this.player1.play(this.disabledSecurity);
            expect(this.player2.player.discard.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
