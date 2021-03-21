describe('Cocoon', function () {
    describe('Cocoon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['dust-pixie', 'butterfly', 'larva', 'cocoon']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not be destroyed if played and is able to destroy a larva', function () {
            this.player1.play(this.larva);
            this.player1.play(this.cocoon);
            this.player1.clickCard(this.larva);
            this.player1.endTurn();
            expect(this.cocoon.location).toBe('play area');
            expect(this.larva.location).toBe('discard');
        });

        it('should be destroyed if played when there are no ceatures', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.play(this.cocoon);
            this.player1.endTurn();
            expect(this.cocoon.location).toBe('discard');
        });

        it('should do nothing when there is no butterfly in the discard', function () {
            this.player1.moveCard(this.cocoon, 'play area');
            this.player1.moveCard(this.dustPixie, 'discard');
            expect(this.dustPixie.location).toBe('discard');
            this.player1.useAction(this.cocoon);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should pick up butterfly from discard pile', function () {
            this.player1.moveCard(this.cocoon, 'play area');
            this.player1.moveCard(this.butterfly, 'discard');
            expect(this.butterfly.location).toBe('discard');
            this.player1.useAction(this.cocoon);
            this.player1.clickCard(this.butterfly);
            this.player1.endTurn();
            expect(this.butterfly.location).toBe('hand');
        });
    });
});
