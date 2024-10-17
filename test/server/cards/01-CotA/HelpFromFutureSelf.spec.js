describe('Help from Future Self', function () {
    describe("Help from Future Self's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['help-from-future-self'],
                    discard: ['timetraveller']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should allow retrieval of Timetraveleer from the discard', function () {
            this.player1.play(this.helpFromFutureSelf);
            expect(this.player1).toHavePrompt('Help From Future Self');
            expect(this.player1).toBeAbleToSelect(this.timetraveller);
            this.player1.clickCard(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.timetraveller.location).toBe('hand');
        });

        it('should allow retrieval of Timetraveleer from the deck', function () {
            this.player1.moveCard(this.timetraveller, 'deck');
            this.player1.play(this.helpFromFutureSelf);
            expect(this.player1).toHavePrompt('Help From Future Self');
            expect(this.player1).toBeAbleToSelect(this.timetraveller);
            this.player1.clickCard(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.timetraveller.location).toBe('hand');
        });

        it('should allow fail to find', function () {
            this.player1.play(this.helpFromFutureSelf);
            expect(this.player1).toHavePrompt('Help From Future Self');
            expect(this.player1).toBeAbleToSelect(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.timetraveller.location).toBe('deck');
        });

        it('should fail to find when the card is in hand', function () {
            this.player1.moveCard(this.timetraveller, 'hand');
            this.player1.play(this.helpFromFutureSelf);
            expect(this.player1).toHavePrompt('Help From Future Self');
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.timetraveller.location).toBe('hand');
        });
    });
});
