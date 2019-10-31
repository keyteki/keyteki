describe('United Action', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['lieutenant-khrkhar', 'safe-place'],
                        hand: ['united-action', 'phase-shift', 'shadow-self', 'armsmaster-molina']
                    },
                    player2: {
                        inPlay: ['urchin','crash-muldoon'],
                        amber: 3
                    }
                });

                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                this.player1.clickPrompt('staralliance');
                this.player1.play(this.unitedAction);
            });

            it('should not allow cards to use used', function() {
                this.player1.clickCard(this.lieutenantKhrkhar);

                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            describe('and a in-house card is played', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.armsmasterMolina);
                });

                it('should allow the card to be played', function() {
                    expect(this.player1).toHavePrompt('Play Armsmaster Molina:');
                });
            });

            describe('and a out of house card is played', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shadowSelf);
                });

                it('should allow the card to be played', function() {
                    expect(this.player1).toHavePrompt('Play Shadow Self:');
                });
            });

            describe('and an out of house card is played that is not represented in play', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.phaseShift);
                });

                it('should allow the card to be played', function() {
                    expect(this.player1).not.toHavePrompt('Play this action');
                });
            });
        });
    });
});
