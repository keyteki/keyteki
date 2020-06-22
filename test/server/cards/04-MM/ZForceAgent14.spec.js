describe('Z-Force Agent 14', function () {
    describe("Z-Force Agent 14's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['z-force-agent-14'],
                    hand: ['z-wave-emitter', 'force-field', 'light-of-the-archons'],
                    amber: 3
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not gain amber, if there is no upgrade', function () {
            this.player1.fightWith(this.zForceAgent14, this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });

        it('should gain 1A per upgrade after fight', function () {
            this.player1.playUpgrade(this.zWaveEmitter, this.zForceAgent14); //+1A
            this.player1.playUpgrade(this.forceField, this.zForceAgent14); //+1A
            this.player1.playUpgrade(this.lightOfTheArchons, this.zForceAgent14); //+1A
            this.player1.fightWith(this.zForceAgent14, this.lamindra); //+3A
            expect(this.player1.amber).toBe(9);
            expect(this.player2.amber).toBe(2);
        });
    });
});
