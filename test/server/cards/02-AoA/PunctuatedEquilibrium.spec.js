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
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should refill to less than 6 cards with chains.', function () {
            this.player1.chains = 1;
            this.player2.chains = 7;
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1.hand.length).toBe(5);
            expect(this.player2.hand.length).toBe(4);
            expect(this.player1.chains).toBe(0);
            expect(this.player2.chains).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Punctuated Equilibrium's discard ordering", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'bad-penny', 'urchin']
                },
                player2: {
                    hand: ['timetraveller', 'dextre', 'daughter']
                }
            });
        });

        it('should prompt for discard order when both players have cards', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards their hand first');
            this.player1.clickPrompt('Me');
            expect(this.punctuatedEquilibrium.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.daughter.location).toBe('discard');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow choosing opponent to discard first', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards their hand first');
            this.player1.clickPrompt('Opponent');
            expect(this.punctuatedEquilibrium.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.daughter.location).toBe('discard');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Punctuated Equilibrium with scrap abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'brillix-ponder', 'bad-penny', 'lamindra']
                },
                player2: {
                    hand: ['timetraveller', 'dextre', 'daughter']
                }
            });
        });

        it('should allow active player to choose discard order for scrap abilities', function () {
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards their hand first');
            this.player1.clickPrompt('Opponent');
            expect(this.player1).toHavePrompt('Select next card to discard');
            expect(this.player1).toBeAbleToSelect(this.brillixPonder);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.brillixPonder);
            expect(this.punctuatedEquilibrium.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.daughter.location).toBe('discard');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
