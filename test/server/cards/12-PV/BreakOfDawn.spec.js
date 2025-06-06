describe('Break of Dawn', function () {
    describe("Break of Dawn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['break-of-dawn'],
                    discard: ['flaxia', 'dew-faerie', 'troll', 'krump']
                },
                player2: {
                    amber: 2
                }
            });

            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.dewFaerie, 'deck');
        });

        it('should discard the top 3 cards and return Untamed cards to hand', function () {
            this.player1.play(this.breakOfDawn);
            expect(this.troll.location).toBe('discard');
            expect(this.flaxia.location).toBe('hand');
            expect(this.dewFaerie.location).toBe('hand');
            expect(this.krump.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
