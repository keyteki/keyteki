describe('Punctuated Equilibrium', function () {
    describe("Punctuated Equilibrium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: [
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'punctuated-equilibrium'
                    ]
                },
                player2: {}
            });
        });

        it('should refill to 6 cards.', function () {
            this.player1.play(this.punctuatedEquilibrium);
            // Only player1 has cards to discard, so no ordering prompt
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });

        it('should refill to less than 6 cards with chains.', function () {
            this.player1.chains = 1;
            this.player2.chains = 7;
            this.player1.play(this.punctuatedEquilibrium);
            // Only player1 has cards to discard, so no ordering prompt
            expect(this.player1.hand.length).toBe(5);
            expect(this.player2.hand.length).toBe(4);
            expect(this.player1.chains).toBe(0);
            expect(this.player2.chains).toBe(6);
        });
    });

    describe("Punctuated Equilibrium's discard ordering", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'bad-penny', 'bad-penny']
                },
                player2: {
                    hand: ['timetraveller', 'dextre', 'urchin']
                }
            });
        });

        it('should prompt for discard order when both players have cards', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });

        it('should allow choosing opponent to discard first', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Opponent');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });
    });

    describe('Punctuated Equilibrium with scrap abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'brillix-ponder', 'bad-penny'],
                    deck: ['bad-penny', 'bad-penny', 'bad-penny']
                },
                player2: {
                    hand: ['bad-penny', 'bad-penny']
                }
            });
        });

        it('should allow active player to choose discard order for scrap abilities', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            // Player1 should be prompted to select which card to discard first
            // because brillix-ponder has a scrap ability
            expect(this.player1).toHavePrompt('Select next card to discard');
            expect(this.player1).toBeAbleToSelect(this.brillixPonder);
            this.player1.clickCard(this.brillixPonder);
            // After scrap triggers, there should still be a card to discard (bad-penny + drawn card)
            // Since there's no scrap left, remaining cards are discarded automatically
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });

        it('should discard cards drawn by scrap abilities', function () {
            // Track the top card of deck before playing
            const topOfDeck = this.player1.player.deck[0];
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1).toHavePrompt('Select next card to discard');
            // Choose brillix-ponder first - it will draw the top card from deck
            this.player1.clickCard(this.brillixPonder);
            // Brillix Ponder should be in discard
            expect(this.brillixPonder.location).toBe('discard');
            // The drawn card should also be discarded along with bad-penny
            expect(topOfDeck.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
            // Hand refills after all discards
            expect(this.player1.hand.length).toBe(6);
        });
    });
});
