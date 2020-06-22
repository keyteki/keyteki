describe("Vault's Blessing", function () {
    describe("Vault's Blessing", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia', 'chonkers', 'chronus', 'dextre', 'hapsis', 'dysania'],
                    hand: ['vault-s-blessing']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'umbra', 'splinter', 'boss-zarek']
                }
            });
        });

        it('should give 1A to each player for every mutant creature they control', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.vaultSBlessing);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
