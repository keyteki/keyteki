describe('Kymoor Outpost', function () {
    describe("Kymoor Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    inPlay: ['kymoor-outpost', 'umbra']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dust-pixie']
                }
            });

            this.stooge1 = this.player1.player.deck[0];
        });

        it('should put a friendly creature on bottom, make a token and steal 1', function () {
            this.player1.useAction(this.kymoorOutpost);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.umbra);
            expect(this.stooge1.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
