describe('Forge Compiler', function () {
    describe("Forge Compiler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['forge-compiler', 'stealer-of-souls', 'screaming-cave']
                },
                player2: {
                    amber: 6,
                    inPlay: ['batdrone']
                }
            });
        });

        it('should destroy itself and ward all friendly creatures when a key is forged', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');

            expect(this.forgeCompiler.location).toBe('discard');
            expect(this.stealerOfSouls.warded).toBe(true);
            expect(this.stealerOfSouls.location).toBe('play area');
            expect(this.batdrone.warded).toBe(false);
        });
    });
});
