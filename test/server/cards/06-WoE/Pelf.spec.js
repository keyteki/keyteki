describe('Pelf', function () {
    describe("Pelf's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['pelf']
                },
                player2: {
                    amber: 3,
                    inPlay: ['toad', 'chenille']
                }
            });
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent dies', function () {
            this.player1.fightWith(this.pelf, this.toad);
            expect(this.toad.location).toBe('discard');
            expect(this.pelf.damage).toBe(0);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should not cause the controller of a creature it attacks to lose an amber when it dies', function () {
            this.player1.fightWith(this.pelf, this.chenille);
            expect(this.chenille.damage).toBe(0);
            expect(this.pelf.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });
    });
});
