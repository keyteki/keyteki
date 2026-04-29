describe('The Howling Pit', function () {
    describe("The Howling Pit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['the-howling-pit']
                },
                player2: {
                    house: 'shadows',
                    hand: ['poltergeist']
                }
            });
        });

        it('should increase hand size by 1 for each player', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(7);
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.hand.length).toBe(7);
            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not increase hand size if destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.theHowlingPit);
            expect(this.theHowlingPit.location).toBe('discard');
            this.player2.endTurn();
            expect(this.player2.hand.length).toBe(6);
            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
