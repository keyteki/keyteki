describe('Nizak, the Forgotten', function () {
    describe('when fighting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['nizak-the-forgotten', 'troll']
                },
                player2: {
                    inPlay: ['mother']
                }
            });

            this.player1.fightWith(this.nizakTheForgotten, this.mother);
        });

        it('should take no damage', function () {
            expect(this.nizakTheForgotten.tokens.damage).toBe(undefined);
        });

        it('should return the destroyed creature to its owners hand', function () {
            expect(this.mother.location).toBe('hand');
        });
    });
});
