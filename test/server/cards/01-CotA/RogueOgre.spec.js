describe('Rogue Ogre', function () {
    describe("Rogue Ogre's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'brobnar',
                    inPlay: ['rogue-ogre'],
                    hand: ['troll', 'valdr']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone']
                }
            });
        });

        it('should not activate when no cards are played', function () {
            this.player1.endTurn();
            expect(this.player2.amber).toBe(4);
            expect(this.rogueOgre.hasToken('amber')).toBe(false);
        });

        it('should capture an amber when one card is played', function () {
            this.player1.play(this.troll);
            this.player1.endTurn();
            expect(this.player2.amber).toBe(3);
            expect(this.rogueOgre.tokens.amber).toBe(1);
        });
    });
});
