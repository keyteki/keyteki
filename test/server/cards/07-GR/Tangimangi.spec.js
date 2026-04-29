describe('Tangimangi', function () {
    describe("Tangimangi's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['tangimangi']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('should forge a key paying 6A while not haunted', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(0);
        });

        it('should forge a key paying 9A while haunted', function () {
            this.player1.fightWith(this.tangimangi, this.batdrone);
            this.player2.amber = 9;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(0);
        });
    });
});
