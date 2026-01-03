describe('Admirable Neophyte', function () {
    describe("Admirable Neophyte's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    token: 'zealot',
                    hand: ['admirable-neophyte'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });

            this.zealot1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.playCreature(this.admirableNeophyte);
            this.player1.clickPrompt('Right');
            expect(this.zealot1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
