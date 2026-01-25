describe('Ecto-Charge', function () {
    describe("Ecto-Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 9,
                    hand: ['ecto-charge'],
                    inPlay: Array(10).fill('brammo'),
                    discard: Array(25).fill('brammo')
                },
                player2: {
                    inPlay: ['john-smyth', 'faust-the-great']
                }
            });

            this.faustTheGreat.amber = 2;
            this.johnSmyth.amber = 1;
        });

        it('should forge a key paying 8 amber', function () {
            // cost is 8 => 8 + 20 - 25 = 3 (minimum is 6)
            this.player1.play(this.ectoCharge);
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(4);
            expect(this.ectoCharge.location).toBe('purged');
            this.player1.endTurn();
        });

        it('should forge a key if cost is 10', function () {
            // cost is 8 => 8 + 20 - 18 = 10
            this.player1.player.discard = this.player1.player.discard.slice(0, 18);
            this.player1.play(this.ectoCharge);
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.ectoCharge.location).toBe('purged');
            this.player1.endTurn();
        });

        it('should not forge a key if cost is 11, and not purge Ecto-Charge', function () {
            // cost is 8 => 8 + 20 - 17 = 11
            this.player1.player.discard = this.player1.player.discard.slice(0, 17);
            this.player1.play(this.ectoCharge);
            expect(this.player1.amber).toBe(10);
            expect(this.ectoCharge.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
