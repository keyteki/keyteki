describe('GargantesScrapper', function () {
    describe("GargantesScrapper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    inPlay: ['mugwump', 'brammo', 'foozle', 'troll'],
                    hand: ['gargantes-scrapper']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'brend-the-fanatic']
                }
            });
        });

        it('should do no damage when player has less than 3 amber', function () {
            this.player1.play(this.gargantesScrapper);

            expect(this.player1).not.toBeAbleToSelect(this.brendTheFanatic);

            expect(this.troll.tokens.damage).toBe(undefined);
        });

        it('should do 3 damage to a target when the player has 3 or more amber', function () {
            this.player1.amber = 3;
            this.player1.play(this.gargantesScrapper);
            expect(this.player1).toHavePrompt('Gargantes Scrapper');
            expect(this.player1).toBeAbleToSelect(this.brendTheFanatic);
            this.player1.clickCard(this.brendTheFanatic);

            expect(this.brendTheFanatic.location).toBe('discard');
        });
    });
});
