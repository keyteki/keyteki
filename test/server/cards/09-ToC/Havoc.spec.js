describe('Havoc', function () {
    describe("Havoc's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    hand: ['havoc'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });

            this.toad1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.playCreature(this.havoc);
            this.player1.clickPrompt('Left');
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
