describe('Archimedes', function() {
    integration(function() {
        describe('Archimedes\' gain ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['gub', 'archimedes', 'streke', 'krump'],
                        hand: ['collar-of-subordination', 'hand-of-dis', 'gateway-to-dis', 'shooler']
                    },
                    player2: {
                        inPlay: ['lamindra'],
                        hand: ['relentless-whispers']
                    }
                });
            });

            it('should move destroyed neighbor to archive', function() {
                this.player1.play(this.handOfDis);
                this.player1.clickCard(this.streke);

                expect(this.streke.location).toBe('archives');
                expect(this.player1.player.archives.includes(this.streke)).toBe(true);
            });

            it('should move only immediate neighbors to archive on a board wipe', function() {
                this.player1.play(this.gatewayToDis);

                // an interrupt
                this.player1.clickCard(this.gub);

                expect(this.streke.location).toBe('archives');
                expect(this.gub.location).toBe('archives');
                expect(this.krump.location).toBe('discard');
                expect(this.archimedes.location).toBe('discard');

                expect(this.player1.player.archives.includes(this.streke)).toBe(true);
                expect(this.player1.player.archives.includes(this.gub)).toBe(true);

                expect(this.player1.player.discard.includes(this.archimedes)).toBe(true);
                expect(this.player1.player.discard.includes(this.krump)).toBe(true);
            });

            it('should move controlled neighbor to opponent\'s archive', function() {

                this.player1.moveCard(this.gub, 'discard');
                expect(this.gub.location).toBe('discard');

                this.player1.playUpgrade(this.collarOfSubordination, this.lamindra);
                this.player1.clickPrompt('Left');
                this.player1.playCreature(this.shooler, true);
                this.player1.play(this.handOfDis);
                this.player1.clickCard(this.lamindra);

                expect(this.streke.location).toBe('play area');
                expect(this.krump.location).toBe('play area');
                expect(this.archimedes.location).toBe('play area');
                expect(this.collarOfSubordination.location).toBe('discard');
                expect(this.lamindra.location).toBe('archives');

                expect(this.player2.player.archives.includes(this.lamindra)).toBe(true);
            });
        });
    });
});
