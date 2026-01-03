describe('Collector Boren', function () {
    describe("Collector Boren's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['helmsman-spears'],
                    hand: ['collector-boren', 'echo-reflector', 'particle-sweep']
                }
            });
        });

        it('should ready when an upgrade is attached', function () {
            this.player1.playCreature(this.collectorBoren);
            expect(this.collectorBoren.exhausted).toBe(true);
            this.player1.playUpgrade(this.echoReflector, this.collectorBoren);
            expect(this.collectorBoren.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should get an upgrade from discard when played', function () {
            this.player1.playUpgrade(this.echoReflector, this.helmsmanSpears);
            this.player1.play(this.particleSweep);
            this.player1.clickCard(this.helmsmanSpears);
            expect(this.echoReflector.location).toBe('discard');
            this.player1.playCreature(this.collectorBoren);
            this.player1.clickCard(this.echoReflector);
            expect(this.echoReflector.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
