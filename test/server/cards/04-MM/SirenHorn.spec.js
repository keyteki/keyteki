describe('Siren Horn', function () {
    describe("Siren Horn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['siren-horn'],
                    inPlay: ['senator-shrix']
                },
                player2: {
                    inPlay: ['little-rapscal', 'troll', 'nexus']
                }
            });
        });

        it('should make the fight target gain 1 amber and the upgraded creature lose 1 amber', function () {
            this.senatorShrix.tokens.amber = 2;

            this.player1.playUpgrade(this.sirenHorn, this.senatorShrix);
            this.player1.fightWith(this.senatorShrix, this.littleRapscal);

            expect(this.senatorShrix.tokens.amber).toBe(1);
            expect(this.littleRapscal.tokens.amber).toBe(1);
        });

        it('should not move 1 amber if the fight source has no amber on it', function () {
            this.senatorShrix.tokens.amber = undefined;

            this.player1.playUpgrade(this.sirenHorn, this.senatorShrix);
            this.player1.fightWith(this.senatorShrix, this.littleRapscal);

            expect(this.senatorShrix.tokens.amber).toBe(undefined);
            expect(this.littleRapscal.tokens.amber).toBe(undefined);
        });
    });
});
