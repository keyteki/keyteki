describe('Crystal Surge', function () {
    describe("Crystal Surge's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['citizen-shrix', 'senator-shrix'],
                    hand: ['crystal-surge']
                },
                player2: {
                    amber: 3,
                    inPlay: ['chronus', 'dysania', 'redlock']
                }
            });
        });

        it('should exalt each mutant creature', function () {
            expect(this.citizenShrix.amber).toBe(0);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.chronus.amber).toBe(0);
            expect(this.dysania.amber).toBe(0);
            expect(this.redlock.amber).toBe(0);
            this.player1.play(this.crystalSurge);
            expect(this.citizenShrix.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.chronus.amber).toBe(1);
            expect(this.dysania.amber).toBe(1);
            expect(this.redlock.amber).toBe(0);
        });
    });
});
