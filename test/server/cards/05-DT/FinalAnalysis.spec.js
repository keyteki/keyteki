describe('Final Analysis', function () {
    describe("Final Analysis' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['final-analysis'],
                    inPlay: ['flaxia', 'bumblebird', 'halacor', 'animator']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'murkens', 'anomaly-exploiter']
                }
            });

            this.gub.ward();
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(0);
            this.player1.play(this.finalAnalysis);
        });

        it('should destroy all creatures', function () {
            expect(this.flaxia.location).toBe('discard');
            expect(this.bumblebird.location).toBe('discard');
            expect(this.halacor.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.murkens.location).toBe('discard');
            expect(this.animator.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
        });

        it('each player should draw cards for each card destroyed this way', function () {
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(1);
            this.player1.endTurn();
        });
    });
});
