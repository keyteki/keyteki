describe('Strange Gizmo', function() {
    integration(function() {
        describe('Strange Gizmo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['stealer-of-souls', 'screaming-cave']
                    },
                    player2: {
                        amber: 6,
                        inPlay: ['strange-gizmo', 'batdrone']
                    }
                });
            });

            it('should trigger when a key is forged', function() {
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(1);
                expect(this.stealerOfSouls.location).toBe('discard');
                expect(this.screamingCave.location).toBe('discard');
                expect(this.strangeGizmo.location).toBe('discard');
                expect(this.batdrone.location).toBe('discard');
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});
