describe('Grey Abbess', function () {
    describe("Grey Abbess's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 5,
                    token: 'cleric',
                    hand: ['grey-abbess', 'shorty'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 5,
                    token: 'cleric',
                    hand: ['troll'],
                    inPlay: ['cleric:krump']
                }
            });

            this.player1.moveCard(this.shorty, 'deck');
        });

        it('should make a token creature and give 1 armor to friendly tokens', function () {
            this.player1.play(this.greyAbbess);
            this.player1.clickPrompt('Left');
            expect(this.shorty.location).toBe('play area');
            expect(this.shorty.name).toBe('Cleric');
            expect(this.shorty.armor).toBe(1);
            this.player1.endTurn();
        });

        it('should not boost the armor of enemy tokens', function () {
            this.player1.play(this.greyAbbess);
            this.player1.clickPrompt('Left');
            expect(this.player2.player.creaturesInPlay[0].armor).toBe(0);
            this.player1.endTurn();
        });
    });
});
