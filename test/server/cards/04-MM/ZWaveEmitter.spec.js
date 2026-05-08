describe('Z-Wave Emitter', function () {
    describe("Z-Wave Emitter's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['z-force-agent-14'],
                    hand: ['z-wave-emitter'],
                    amber: 3
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should ward the creature at the start of turn', function () {
            this.player1.playUpgrade(this.zWaveEmitter, this.zForceAgent14);
            this.player1.endTurn();
            expect(this.zForceAgent14.warded).toBe(false);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.zForceAgent14.warded).toBe(true);
        });

        it('should ward enemy creature at the start of their turn', function () {
            this.player1.playUpgrade(this.zWaveEmitter, this.lamindra);
            this.player1.endTurn();
            expect(this.lamindra.warded).toBe(true);
        });

        it('should last for several turns', function () {
            this.player1.playUpgrade(this.zWaveEmitter, this.zForceAgent14);
            this.player1.endTurn();
            expect(this.zForceAgent14.warded).toBe(false);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.zForceAgent14.warded).toBe(true);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.lamindra, this.zForceAgent14);
            expect(this.zForceAgent14.warded).toBe(false);
            this.player2.endTurn();
            expect(this.zForceAgent14.warded).toBe(true);
        });
    });
});
