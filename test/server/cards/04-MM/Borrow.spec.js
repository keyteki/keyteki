describe('Borrow', function () {
    describe("Borrow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    hand: ['borrow', 'troll', 'dominator-bauble'],
                    inPlay: ['the-sting']
                },
                player2: {
                    amber: 2,
                    inPlay: ['city-gates', 'customs-office']
                }
            });
        });

        it('should take control of an artifact', function () {
            this.player1.play(this.borrow);
            expect(this.player1).toBeAbleToSelect(this.cityGates);
            expect(this.player1).toBeAbleToSelect(this.customsOffice);
            expect(this.player1).not.toBeAbleToSelect(this.theSting);
            this.player1.clickCard(this.cityGates);
            expect(this.player1.player.cardsInPlay).toContain(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);
            expect(this.cityGates.hasHouse('shadows')).toBe(true);
            expect(this.cityGates.hasHouse('saurian')).toBe(false);
        });

        it('should not change the house of a shadows artifact', function () {
            this.player1.play(this.borrow);
            this.player1.clickCard(this.customsOffice);
            expect(this.player1.player.cardsInPlay).toContain(this.customsOffice);
            expect(this.customsOffice.controller).toBe(this.player1.player);
            expect(this.customsOffice.hasHouse('shadows')).toBe(true);
        });
    });

    describe('when control of the borrowed artifact returns to the original player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['borrow', 'art-project']
                },
                player2: {
                    inPlay: ['city-gates', 'uncommon-currency']
                }
            });
        });

        it('should remain in house Shadows because the Borrow effect does not expire', function () {
            this.player1.play(this.borrow);
            this.player1.clickCard(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);
            expect(this.cityGates.getHouses()).toEqual(['shadows']);

            // Player2 swaps City Gates back via their Uncommon Currency.
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.cityGates);
            this.player2.clickCard(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player2.player);
            expect(this.cityGates.getHouses()).toEqual(['saurian']);

            // Player1 swaps City Gates back via the same Uncommon Currency.
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.uncommonCurrency.ready();
            this.player1.useAction(this.uncommonCurrency);
            this.player1.clickCard(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);

            // The Borrow house-change should still apply.
            expect(this.cityGates.getHouses()).toEqual(['shadows']);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
