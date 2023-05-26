describe('Recruit', function () {
    describe("Recruit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    token: 'senator',
                    inPlay: ['daughter'],
                    hand: ['recruit']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.deckCard = this.player1.deck[0];
        });

        it('should make a token creature when played and go to discard if no exalt happened this turn', function () {
            this.player1.play(this.recruit);
            this.player1.clickPrompt('Left');
            let senator = this.player1.inPlay[0];
            expect(senator.name).toBe('Senator');
            expect(senator).toBe(this.deckCard);
            expect(senator.exhausted).toBe(true);
            expect(this.recruit.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
