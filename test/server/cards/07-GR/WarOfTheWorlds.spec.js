describe('War of the Worlds', function () {
    describe("War of the Worlds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['war-of-the-worlds'],
                    inPlay: ['tunk', 'flaxia']
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'zizok']
                }
            });
        });

        it('destroys all non-Mars creatures', function () {
            this.player1.play(this.warOfTheWorlds);
            expect(this.tunk.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.groggins.location).toBe('discard');
            expect(this.zizok.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('deals 2 damage to all Mars creatures', function () {
            this.player1.play(this.warOfTheWorlds);
            expect(this.tunk.tokens.damage).toBe(1);
            expect(this.zizok.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
