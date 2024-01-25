describe('U.F.O.', function () {
    describe("U.F.O.'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['ufo', 'mars-first', 'umbra', 'urchin', 'krump', 'anger']
                },
                player2: {
                    amber: 2,
                    inPlay: ['tunk']
                }
            });
        });

        it('should discard cards from the top of deck until a Mars card is found', function () {
            this.player1.moveCard(this.marsFirst, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.anger, 'deck');

            this.player1.play(this.ufo);
            expect(this.umbra.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.marsFirst.location).toBe('hand');
        });
    });
});
