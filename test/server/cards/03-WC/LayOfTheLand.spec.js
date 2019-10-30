describe('Lay of the land', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['krump'],
                        hand: ['lay-of-the-land', 'troll', 'bumpsy', 'titan-mechanic', 'brain-eater'],
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

                this.player1.play(this.layOfTheLand);
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

                    it('should draw the top card of the deck', function() {
                        expect(this.player1.hand).toContain(this.titanMechanic);
                    });

                    it('should rearrange the rest of the cards in the deck', function() {
                        expect(this.player1.deck[0]).toBe(this.troll);
                        expect(this.player1.deck[1]).toBe(this.bumpsy);
                    });
                });
            });
        });
    });
});
