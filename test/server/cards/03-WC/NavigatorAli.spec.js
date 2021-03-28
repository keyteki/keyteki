describe('Navigator Ali', function () {
    describe('when played', function () {
        beforeEach(function () {
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
        });

        describe('Play Navigator Ali with 3+ cards in deck', function () {
            beforeEach(function () {
                this.player1.moveCard(this.titanMechanic, 'deck');
                this.player1.moveCard(this.bumpsy, 'deck');
                this.player1.moveCard(this.troll, 'deck');
                this.player1.play(this.navigatorAli);
            });

            it('should prompt the top 3 cards from the deck', function () {
                expect(this.player1).toHavePromptCardButton(this.troll);
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
                expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should prompt for the next card', function () {
                    expect(this.player1).toHavePromptCardButton(this.troll);
                    expect(this.player1).toHavePromptCardButton(this.titanMechanic);
                });

                describe('and a card is selected', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('troll');
                    });

                    it('should rearrange the cards in the deck', function () {
                        expect(this.player1.deck[0]).toBe(this.titanMechanic);
                        expect(this.player1.deck[1]).toBe(this.troll);
                        expect(this.player1.deck[2]).toBe(this.bumpsy);
                    });

                    it('should have correct prompt', function () {
                        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                    });
                });
            });
        });

        describe('Play Navigator Ali with 2 cards in deck', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.bumpsy, 'deck');
                this.player1.moveCard(this.troll, 'deck');
                this.player1.play(this.navigatorAli);
            });

            it('should prompt the top 2 cards from the deck', function () {
                expect(this.player1).toHavePromptCardButton(this.troll);
                expect(this.player1).toHavePromptCardButton(this.bumpsy);
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('bumpsy');
                });

                it('should rearrange the cards in the deck', function () {
                    expect(this.player1.deck[0]).toBe(this.troll);
                    expect(this.player1.deck[1]).toBe(this.bumpsy);
                });

                it('should have correct prompt', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('Play Navigator Ali with 1 card in deck', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.bumpsy, 'deck');
                this.player1.play(this.navigatorAli);
            });

            it('should put card back into deck', function () {
                expect(this.player1.deck[0]).toBe(this.bumpsy);
            });

            it('should have correct prompt', function () {
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('Play Navigator Ali with 0 card in deck', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.play(this.navigatorAli);
            });

            it('should rearrange the cards in the deck', function () {
                expect(this.player1.deck.length).toBe(0);
            });

            it('should have correct prompt', function () {
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
