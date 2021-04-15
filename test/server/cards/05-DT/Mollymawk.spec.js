describe('Mollymawk', function () {
    describe("Mollymawk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['orb-of-wonder', 'tantadlin'],
                    hand: ['mollymawk']
                },
                player2: {
                    inPlay: ['snufflegator', 'library-card']
                }
            });
        });

        it('should destroy an artifact', function () {
            this.player1.play(this.mollymawk);
            expect(this.player1).toBeAbleToSelect(this.orbOfWonder);
            expect(this.player1).toBeAbleToSelect(this.libraryCard);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
            this.player1.clickCard(this.libraryCard);
            expect(this.libraryCard.location).toBe('discard');
            expect(this.orbOfWonder.location).toBe('play area');
        });
    });
});
