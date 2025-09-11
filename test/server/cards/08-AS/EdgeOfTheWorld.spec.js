describe('Edge of the World', function () {
    describe("Edge of the World's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'skyborn',
                    hand: ['edge-of-the-world'],
                    inPlay: ['gub', 'charette']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'eldest-bear', 'umbra']
                }
            });
        });

        it('should move friendly creatures and steal', function () {
            this.player1.play(this.edgeOfTheWorld);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.eldestBear);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.gub);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move enemy creatures and steal', function () {
            this.player1.play(this.edgeOfTheWorld);
            this.player1.clickCard(this.eldestBear);
            this.player1.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay[2]).toBe(this.eldestBear);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
