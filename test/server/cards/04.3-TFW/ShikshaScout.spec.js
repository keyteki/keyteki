describe('Shiksha Scout', function () {
    integration(function () {
        describe('Shiksha Scout\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['shiksha-scout'],
                        hand: [],
                        conflictDeck: []
                    }
                });
                this.shikshaScout = this.player1.findCardByName('shiksha-scout', 'play area');
                this.noMoreActions();
            });

            it('should increment the number of participants in the conflict by 1 if participating in the conflict.', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['shiksha-scout'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.game.currentConflict.getNumberOfParticipantsFor(this.player1.player)).toBe(2);
            });
        });
    });
});
