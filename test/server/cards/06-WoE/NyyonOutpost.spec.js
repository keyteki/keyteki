describe('Nyyon Outpost', function () {
    describe("Nyyon Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    inPlay: ['blypyp', 'nyyon-outpost'],
                    deck: ['pelf', 'pelf', 'pelf']
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });
        });

        it('put a creature on the bottom of your deck and make 2 token creatures', function () {
            this.player1.useAction(this.nyyonOutpost);
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Left');
            expect(this.blypyp.location).toBe('deck');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fizzle with no creatures in play', function () {
            this.player1.fightWith(this.blypyp, this.kelifiDragon);
            this.player1.useAction(this.nyyonOutpost);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
