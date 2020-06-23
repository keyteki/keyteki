describe('Operations Officer Yshi', function () {
    describe("Operations Officer Yshi's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'operations-officer-yshi', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mighty-tiger', 'snufflegator', 'dust-pixie']
                }
            });
        });
        it('should grant reap: capture 1 to its neighbors', function () {
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.lieutenantKhrkhar.tokens.amber).toBe(1);
            this.player1.reap(this.sensorChiefGarcia);
            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.clickPrompt('Sensor Chief Garcia');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.tokens.amber).toBe(1);
        });
        it('should grant fight: capture 1 to its neighbors', function () {
            this.player1.fightWith(this.lieutenantKhrkhar, this.dustPixie);
            expect(this.player2.amber).toBe(3);
            expect(this.lieutenantKhrkhar.tokens.amber).toBe(1);
        });
    });
});
