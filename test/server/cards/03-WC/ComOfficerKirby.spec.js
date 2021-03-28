describe('Com. Officer Kirby', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['com-officer-kirby', 'urchin'],
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
            this.player1.reap(this.comOfficerKirby);
        });

        it('should allow a non star alliance action card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.wildWormhole);
        });

        it('should not allow a non star alliance action creature to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.shadowSelf);
        });

        it('should allow a non star alliance artifact card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.safePlace);
        });

        it('should allow a non star alliance upgrade card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.rocketBoots);
        });

        it('should not allow a non star alliance card in play to be used', function () {
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });
    });

    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['com-officer-kirby', 'helmsman-spears', 'urchin'],
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
            this.player1.moveCard(this.safePlace, 'deck');
        });
        it("should have an effect that 'floats' and can be used at any time between the trigger and the end of the turn", function () {
            this.player1.reap(this.comOfficerKirby);
            expect(this.safePlace.location).toBe('deck');
            this.player1.reap(this.helmsmanSpears);
            this.player1.clickCard(this.shadowSelf);
            this.player1.clickPrompt('Done');
            expect(this.safePlace.location).toBe('hand');
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.player1).toBeAbleToPlay(this.safePlace);
        });
    });
});
