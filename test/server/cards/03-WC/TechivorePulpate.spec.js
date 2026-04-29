describe('Techivore Pulpate', function () {
    describe("Techivore Pulpate's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['memory-chip', 'techivore-pulpate', 'skeleton-key'],
                    hand: ['yantzee-gang', 'dextre', 'doc-bookton'],
                    discard: ['batdrone']
                },
                player2: {
                    inPlay: ['speed-sigil'],
                    hand: ['nexus', 'snufflegator', 'inka-the-spider'],
                    discard: ['flaxia']
                }
            });
        });

        it('should not destroy artifacts of non-called house', function () {
            expect(this.memoryChip.location).toBe('play area');
        });
        it('should destroy artifacts of called house', function () {
            expect(this.memoryChip.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.speedSigil.location).toBe('discard');
            expect(this.skeletonKey.location).toBe('discard');
        });
    });
});
