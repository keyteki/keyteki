describe('immunity', function() {
    integration(function() {
        describe('when a card has immunity', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Small Council Chamber', 'Tywin Lannister (Core)', 'Nightmares', 'Put to the Torch'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.chamber = this.player1.findCardByName('Small Council Chamber', 'hand');
                this.character = this.player2.findCardByName('Tywin Lannister', 'hand');

                this.player1.clickCard(this.chamber);
                this.player2.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
            });

            it('should not allow lasting effects to be applied to it', function() {
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.chamber);

                expect(this.chamber.isBlank()).toBe(false);
            });

            it('should not allow actions to be applied to it', function() {
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.character);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickCard('Put to the Torch', 'hand');
                this.player2.clickCard(this.chamber);

                expect(this.chamber.location).toBe('play area');
            });
        });
    });
});
