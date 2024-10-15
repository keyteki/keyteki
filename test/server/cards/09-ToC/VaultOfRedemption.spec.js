describe('Vault of Redemption', function () {
    describe("Vault of Redemption's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['gateway-to-dis'],
                    token: 'zealot',
                    inPlay: ['vault-of-redemption', 'snarette', 'charette', 'zealot:streke']
                },
                player2: {
                    amber: 1,
                    inPlay: ['rad-penny', 'umbra']
                }
            });
        });

        it('should draw a card for each destroyed mutant', function () {
            this.player1.play(this.gatewayToDis);
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
