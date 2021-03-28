describe('CXO Taber', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['cxo-taber', 'urchin'],
                    hand: [
                        'wild-wormhole',
                        'shadow-self',
                        'navigator-ali',
                        'safe-place',
                        'rocket-boots',
                        'armsmaster-molina'
                    ]
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.cxoTaber);
        });

        it('should allow a non star alliance action card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.wildWormhole);
        });

        it('should allow a non star alliance action creature to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.shadowSelf);
        });

        it('should allow a non star alliance artifact card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.safePlace);
        });

        it('should allow a non star alliance upgrade card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.rocketBoots);
        });

        it('should allow a non star alliance card in play to be used', function () {
            expect(this.player1).toBeAbleToPlay(this.urchin);
        });
    });
});
