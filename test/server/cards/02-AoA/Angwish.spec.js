describe('Angwish', function () {
    describe("Angwish's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['shooler', 'angwish', 'yurk']
                },
                player2: {
                    amber: 10,
                    hand: ['remote-access']
                }
            });
        });

        it('should not increase cost, if no damage', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.amber).toBe(4);
        });

        it('should not increase cost, if damage is on another creature', function () {
            this.yurk.tokens.damage = 1;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.amber).toBe(4);
        });

        it('should increase cost equal to damage on Angwish', function () {
            this.shooler.tokens.damage = 3;
            this.angwish.tokens.damage = 3;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.amber).toBe(1);
        });
    });
});
