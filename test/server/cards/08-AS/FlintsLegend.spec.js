describe("Flint's Legend", function () {
    describe("Flint's Legend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'skyborn',
                    hand: ['flint-s-legend'],
                    inPlay: ['treasure-island', 'library-of-babble']
                },
                player2: {
                    amber: 2,
                    inPlay: ['treasure-island']
                }
            });

            this.treasureIsland2 = this.player2.player.cardsInPlay[0];
        });

        it('should move an amber from opponent pool to Treasure Island', function () {
            this.player1.play(this.flintSLegend);
            expect(this.player1).toBeAbleToSelect(this.treasureIsland);
            expect(this.player1).toBeAbleToSelect(this.treasureIsland2);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.treasureIsland);
            expect(this.player2.amber).toBe(1);
            expect(this.treasureIsland.amber).toBe(1);
            expect(this.treasureIsland2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move an amber from opponent pool to opponent Treasure Island', function () {
            this.player1.play(this.flintSLegend);
            this.player1.clickCard(this.treasureIsland2);
            expect(this.player2.amber).toBe(1);
            expect(this.treasureIsland.amber).toBe(0);
            expect(this.treasureIsland2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing if no Treasure Islands', function () {
            this.player1.moveCard(this.treasureIsland, 'discard');
            this.player1.moveCard(this.treasureIsland2, 'discard');
            this.player1.play(this.flintSLegend);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing if no opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.flintSLegend);
            this.player1.clickCard(this.treasureIsland2);
            expect(this.player2.amber).toBe(0);
            expect(this.treasureIsland.amber).toBe(0);
            expect(this.treasureIsland2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
