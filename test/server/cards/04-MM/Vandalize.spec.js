describe('Vandalize', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['redlock'],
                    hand: ['vandalize'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    hand: ['troll', 'bumpsy', 'titan-mechanic', 'brain-eater']
                }
            });
        });

        describe("Play Vandalize with 3+ cards in opponent's deck", function () {
            beforeEach(function () {
                this.player2.moveCard(this.titanMechanic, 'deck');
                this.player2.moveCard(this.bumpsy, 'deck');
                this.player2.moveCard(this.troll, 'deck');
                this.player1.play(this.vandalize);
            });

            it('should prompt the top 3 cards from the deck', function () {
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toHavePromptCardButton(this.troll);
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
                expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should move card to discard', function () {
                    expect(this.bumpsy.location).toBe('discard');
                });

                it('should prompt for the next card', function () {
                    expect(this.player1).toHavePromptCardButton(this.troll);
                    expect(this.player1).toHavePromptCardButton(this.titanMechanic);
                });

                describe('and a card is selected', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('troll');
                    });

                    it('should rearrange the rest the cards in the deck', function () {
                        expect(this.player2.deck[0]).toBe(this.titanMechanic);
                        expect(this.player2.deck[1]).toBe(this.troll);
                    });

                    it('should have correct prompt', function () {
                        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                    });
                });
            });
        });

        describe('Play Vandalize with 2 cards in deck', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.bumpsy, 'deck');
                this.player2.moveCard(this.troll, 'deck');
                this.player1.play(this.vandalize);
            });

            it('should prompt the top 2 cards from the deck', function () {
                expect(this.player1).toHavePromptCardButton(this.troll);
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should move card to discard', function () {
                    expect(this.bumpsy.location).toBe('discard');
                });

                it('should rearrange the rest of the cards in the deck', function () {
                    expect(this.player2.deck[0]).toBe(this.troll);
                });

                it('should have correct prompt', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });
        describe('Play Vandalize with 1 cards in deck', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.bumpsy, 'deck');
                this.player1.play(this.vandalize);
            });

            it('should prompt the top card of the deck', function () {
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should move card to discard', function () {
                    expect(this.bumpsy.location).toBe('discard');
                });

                it('should rearrange the rest of the cards in the deck', function () {
                    expect(this.player2.deck.length).toBe(0);
                });

                it('should have correct prompt', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('Play Vandalize with 0 cards in deck', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player1.play(this.vandalize);
            });

            it('should reshuffle deck and draw', function () {
                expect(this.player2.hand.length).toBe(4);
                expect(this.player2.deck.length).toBe(0);
                expect(this.player1.discard).toContain(this.vandalize);
            });

            it('should have correct prompt', function () {
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
