describe('Alpha Messages', function () {
    describe('alpha restriction from Wild Wormhole', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    discard: ['eureka']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when alpha card cannot be played', function () {
            this.player1.moveCard(this.eureka, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Wild Wormhole',
                "player1 gains an amber due to Wild Wormhole's bonus icon",
                'player1 uses Wild Wormhole to play Eureka!',
                'player1 is unable to play Eureka! and returns it to deck'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
