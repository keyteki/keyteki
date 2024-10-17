describe('Strange Gizmo', function () {
    describe("Strange Gizmo's ability", function () {
        beforeEach(function () {
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

        it('should trigger when a key is forged', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.stealerOfSouls.location).toBe('discard');
            expect(this.screamingCave.location).toBe('discard');
            expect(this.strangeGizmo.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
        });
    });
});
