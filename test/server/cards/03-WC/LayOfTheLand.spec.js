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
            });

            describe('Play Lay of the Land with 3+ cards in deck', function() {
                beforeEach(function() {
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

                        it('should have correct prompt', function() {
                            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                        });
                    });
                });
            });
            describe('Play Lay of the Land with 2 cards in deck', function() {
                beforeEach(function() {
                    this.player1.player.deck = [];
                    this.player1.moveCard(this.bumpsy, 'deck');
                    this.player1.moveCard(this.troll, 'deck');
                    this.player1.play(this.layOfTheLand);
                });

                it('should prompt the top 2 cards from the deck', function() {
                    expect(this.player1).toHavePromptCardButton(this.troll);
                    expect(this.player1).toHavePromptCardButton(this.bumpsy);
                });

                describe('and a card is selected', function() {
                    beforeEach(function() {
                        this.player1.clickPrompt('bumpsy');
                    });

                    it('should draw the top card of the deck', function() {
                    });

                    it('should rearrange the rest of the cards in the deck', function() {
                        expect(this.player1.deck[0]).toBe(this.bumpsy);
                        expect(this.player1.hand).toContain(this.troll);
                    });

                    it('should have correct prompt', function() {
                        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                    });
                });
            });
            describe('Play Lay of the Land with 1 cards in deck', function() {
                beforeEach(function() {
                    this.player1.player.deck = [];
                    this.player1.moveCard(this.bumpsy, 'deck');
                    this.player1.play(this.layOfTheLand);
                });

                it('should draw the top card of the deck', function() {
                });

                it('should rearrange the rest of the cards in the deck', function() {
                    expect(this.player1.deck.length).toBe(0);
                });

                it('should have correct prompt', function() {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
            describe('Play Lay of the Land with 0 cards in deck', function() {
                beforeEach(function() {
                    this.player1.player.deck = [];
                    this.player1.moveCard(this.bumpsy, 'discard');
                    this.player1.play(this.layOfTheLand);
                });

                it('should reshuffle deck and draw', function() {
                    expect(this.player1.hand.length).toBe(4);
                    expect(this.player1.deck.length).toBe(0);
                    expect(this.player1.hand).toContain(this.bumpsy);
                    expect(this.player1.discard).toContain(this.layOfTheLand);
                });

                it('should have correct prompt', function() {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });
    });
});
