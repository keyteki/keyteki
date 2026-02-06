describe('Exhaust Messages', function () {
    describe('exhaust creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['nocturnal-maneuver']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
        });

        it('should log correct message when exhausting a creature', function () {
            this.player1.play(this.nocturnalManeuver);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Nocturnal Maneuver',
                "player1 gains an amber due to Nocturnal Maneuver's bonus icon",
                'player1 uses Nocturnal Maneuver to exhaust Dextre'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
