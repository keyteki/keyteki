describe('Intrepid Exemplar', function () {
    describe("Intrepid Exemplar's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    token: 'zealot',
                    inPlay: ['intrepid-exemplar'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra', 'troll']
                }
            });

            this.zealot1 = this.player1.player.deck[0];
        });

        it('should make a token on fight', function () {
            this.player1.fightWith(this.intrepidExemplar, this.umbra);
            this.player1.clickPrompt('Right');
            expect(this.zealot1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token on destroy', function () {
            this.player1.fightWith(this.intrepidExemplar, this.troll);
            this.player1.clickPrompt('Right');
            expect(this.zealot1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
