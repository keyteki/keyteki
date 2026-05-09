describe('Psychic Bug', function () {
    describe("Psychic Bug's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['psychic-bug']
                },
                player2: {
                    hand: ['batdrone', 'mother']
                }
            });
        });

        it('should reveal opponent hand on play', function () {
            this.player1.moveCard(this.psychicBug, 'hand');
            this.player1.playCreature(this.psychicBug);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Psychic Bug to reveal Batdrone and Mother'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('should reveal opponent hand on reap', function () {
            this.player1.reap(this.psychicBug);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Psychic Bug to reveal Batdrone and Mother'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
