describe('Grimlocus Dux', function () {
    describe("Grimlocus Dux' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['grimlocus-dux']
                },
                player2: {
                    inPlay: ['groke']
                }
            });
        });

        it('should be exalted twice', function () {
            this.player1.playCreature(this.grimlocusDux);

            expect(this.grimlocusDux.tokens.amber).toBe(2);
        });
    });
});
