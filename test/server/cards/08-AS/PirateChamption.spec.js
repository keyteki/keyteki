describe('Pirate Champion', function () {
    describe("Pirate Champion's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'skyborn',
                    inPlay: ['gub', 'pirate-champion', 'charette']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should be able to move it to a flank after a fight', function () {
            this.player1.fightWith(this.pirateChampion, this.lamindra);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.pirateChampion);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be optional', function () {
            this.player1.fightWith(this.pirateChampion, this.lamindra);
            this.player1.clickPrompt('No');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.pirateChampion);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
