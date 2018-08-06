describe('Imperial Librarian', function() {
    integration(function() {
        describe('Imperial Librarian\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['imperial-librarian','agasha-sumiko'],
                        hand: ['formal-invitation','charge']
                    },
                    player2: {
                        inPlay: ['akodo-toturi']
                    }
                });
                this.librarian = this.player1.findCardByName('imperial-librarian');
                this.sumiko = this.player1.findCardByName('agasha-sumiko');
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.noMoreActions();
            });

            it('should correctly modify other character\'s glory', function() {
                this.game.checkGameState(true);
                expect(this.librarian.glory).toBe(2);
                expect(this.toturi.glory).toBe(4);
                expect(this.sumiko.glory).toBe(2);
            });

        });
    });
});
