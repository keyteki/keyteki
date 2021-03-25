describe('Crushing Charge', function () {
    describe("Crushing Charge' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['crushing-charge'],
                    inPlay: ['flaxia', 'bumblebird', 'troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'groggins', 'shooler']
                }
            });
        });

        it('should destroy creatures with power <= 4', function () {
            this.player1.play(this.crushingCharge);
            expect(this.flaxia.location).toBe('discard');
            expect(this.bumblebird.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.groggins.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
        });
    });
});
