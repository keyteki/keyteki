describe('subject-kirby', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['subject-kirby', 'urchin'],
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
            this.player1.reap(this.subjectKirby);
        });

        it('should allow a non star alliance creature to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.shadowSelf);
        });

        it('should not allow a non star alliance action to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.wildWormhole);
        });

        it('should not allow a non star alliance artifact card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.safePlace);
        });

        it('should not allow a non star alliance upgrade card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.rocketBoots);
        });

        it('should not allow a non star alliance card in play to be used', function () {
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });
    });

    describe('when playing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['urchin'],
                    hand: [
                        'subject-kirby',
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
            this.player1.play(this.subjectKirby);
        });

        it('should allow a non star alliance creature to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.shadowSelf);
        });

        it('should not allow a non star alliance action to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.wildWormhole);
        });

        it('should not allow a non star alliance artifact card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.safePlace);
        });

        it('should not allow a non star alliance upgrade card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.rocketBoots);
        });

        it('should not allow a non star alliance card in play to be used', function () {
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });
    });

    describe('when fighting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['subject-kirby', 'urchin'],
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
            this.player1.fightWith(this.subjectKirby, this.lamindra);
        });

        it('should allow a non star alliance creature to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.shadowSelf);
        });

        it('should not allow a non star alliance action to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.wildWormhole);
        });

        it('should not allow a non star alliance artifact card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.safePlace);
        });

        it('should not allow a non star alliance upgrade card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.rocketBoots);
        });

        it('should not allow a non star alliance card in play to be used', function () {
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });
    });
});
