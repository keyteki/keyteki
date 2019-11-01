describe('Navigator Ali', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['krump'],
                        hand: ['navigator-ali', 'troll', 'bumpsy', 'titan-mechanic', 'brain-eater'],
                        amber: 4
                    },
                    player2: {
                        amber: 8,
                        inPlay: ['bumpsy']
                    }
                });

                this.player1.moveCard(this.titanMechanic, 'deck');
                this.player1.moveCard(this.bumpsy, 'deck');
                this.player1.moveCard(this.troll, 'deck');

                this.player1.play(this.navigatorAli);
            });

            it('should prompt the top 3 cards from the deck', function() {
                expect(this.player1).toHavePromptCardButton(this.troll);
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
                expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            });

            describe('and a card is selected', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should prompt for the next card', function() {
                    expect(this.player1).toHavePromptCardButton(this.troll);
                    expect(this.player1).toHavePromptCardButton(this.titanMechanic);
                });

                describe('and a card is selected', function() {
                    beforeEach(function() {
                        this.player1.clickPrompt('troll');
                    });

                    it('should rearrange the cards in the deck', function() {
                        expect(this.player1.deck[0]).toBe(this.titanMechanic);
                        expect(this.player1.deck[1]).toBe(this.troll);
                        expect(this.player1.deck[2]).toBe(this.bumpsy);
                    });
                });
            });
        });
    });
});
