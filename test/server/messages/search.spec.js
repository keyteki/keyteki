describe('Search Messages', function () {
    describe('search deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['help-from-future-self', 'timetraveller']
                },
                player2: {}
            });
        });

        it('should log correct message when searching deck', function () {
            this.player1.moveCard(this.timetraveller, 'deck');
            this.player1.play(this.helpFromFutureSelf);
            this.player1.clickCard(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Help from Future Self',
                "player1 gains an amber due to Help from Future Self's bonus icon",
                'player1 uses Help from Future Self to search for Timetraveller and shuffle discard into their deck',
                'player1 takes Timetraveller into their hand'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
