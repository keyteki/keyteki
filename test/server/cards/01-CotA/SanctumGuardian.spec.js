describe('Sanctum Guardian', function () {
    describe("Sanctum Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'sequis', 'batdrone', 'sanctum-guardian']
                },
                player2: {
                    inPlay: ['snufflegator']
                }
            });
        });

        it('should prompt to swap places when fighting', function () {
            this.player1.fightWith(this.sanctumGuardian, this.snufflegator);
            expect(this.snufflegator.location).toBe('discard');
            expect(this.player1).toHavePrompt('Sanctum Guardian');
        });

        it('should prompt to swap places when reaping', function () {
            this.player1.reap(this.sanctumGuardian);
            expect(this.player1).toHavePrompt('Sanctum Guardian');
        });

        it('should swap places', function () {
            this.player1.reap(this.sanctumGuardian);
            this.player1.clickCard(this.sequis);
            expect(this.sanctumGuardian.neighbors).toContain(this.troll);
            expect(this.sequis.neighbors).not.toContain(this.troll);
        });
    });
});
