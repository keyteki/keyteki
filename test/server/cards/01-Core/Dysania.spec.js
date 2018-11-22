describe('Dysania', function() {
    integration(function() {
        describe('Dysania\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        hand: ['dysania']
                    },
                    player2: {
                        archives: ['dextre', 'labwork', 'ganymede-archivist']
                    }
                });
            });

            it('should discard opponent\'s archives and gain amber', function() {
                this.player1.play(this.dysania);
                expect(this.dextre.location).toBe('discard');
                expect(this.labwork.location).toBe('discard');
                expect(this.ganymedeArchivist.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
            });
        });
    });
});
