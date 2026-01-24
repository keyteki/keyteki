describe('Bosch the Unyielding', function () {
    describe("Bosch the Unyielding's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bosch-the-unyielding', 'alaka']
                },
                player2: {
                    inPlay: ['flaxia', 'troll']
                }
            });
            this.alaka.tokens.damage = 1;
        });

        it('heals after fighting', function () {
            this.player1.fightWith(this.boschTheUnyielding, this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.boschTheUnyielding.damage).toBe(0);
            expect(this.boschTheUnyielding.location).toBe('play area');
            expect(this.alaka.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('heals all damage after fighting', function () {
            this.boschTheUnyielding.tokens.damage = 1;
            this.player1.fightWith(this.boschTheUnyielding, this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.boschTheUnyielding.damage).toBe(0);
            expect(this.boschTheUnyielding.location).toBe('play area');
            expect(this.alaka.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not heal after fighting when it dies', function () {
            this.player1.fightWith(this.boschTheUnyielding, this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.boschTheUnyielding.location).toBe('discard');
            expect(this.alaka.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
