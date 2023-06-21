describe('Martyr of the Vault', function () {
    describe("Martyr of the Vault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['martyr-of-the-vault']
                },
                player2: {
                    amber: 9,
                    inPlay: ['troll']
                }
            });
        });

        it('should make opponent lose all but 5 when destroyed and opponent has at least 7', function () {
            this.player1.fightWith(this.martyrOfTheVault, this.troll);
            expect(this.player2.amber).toBe(5);
        });

        it('should do nothing when destroyed and opponent has fewer than 7', function () {
            this.player2.amber = 6;
            this.player1.fightWith(this.martyrOfTheVault, this.troll);
            expect(this.player2.amber).toBe(6);
        });
    });
});
