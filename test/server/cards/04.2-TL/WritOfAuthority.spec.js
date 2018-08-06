describe('Writ of Authority', function() {
    integration(function() {
        describe('Writ of Authority', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['serene-warrior'],
                        hand: ['writ-of-authority']
                    },
                    player2: {
                        honor: 10,
                        inPlay: []
                    }
                });
                this.WritOfAuthority = this.player1.findCardByName('serene-warrior');
                this.WritOfAuthority = this.player1.findCardByName('writ-of-authority');
            });

            it('should be discarded when its controller has less honor', function() {
                this.player1.honor = 9;
                this.player1.playAttachment('writ-of-authority', 'serene-warrior');
                expect(this.WritOfAuthority.location).toBe('conflict discard pile');
            });

            it('should not be discarded when its controller has equal or greater honor', function() {
                this.player1.playAttachment('writ-of-authority', 'serene-warrior');
                expect(this.WritOfAuthority.location).toBe('play area');
            });
        });
    });
});
