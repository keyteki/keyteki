describe('Stun Messages', function () {
    describe('stun a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['radiant-truth']
                },
                player2: {
                    inPlay: ['troll', 'ganger-chieftain', 'headhunter']
                }
            });
        });

        it('should log correct message when stunning a creature', function () {
            this.player1.play(this.radiantTruth);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Radiant Truth',
                "player1 uses Radiant Truth's amber bonus icon to gain 1 amber",
                'player1 uses Radiant Truth to stun Ganger Chieftain'
            ]);
        });
    });

    describe('remove stun', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {}
            });
            this.troll.stun();
        });

        it('should log correct message when removing stun', function () {
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 exhausts Troll to remove its stun']);
        });
    });
});
