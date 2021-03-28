describe('hystricog', function () {
    describe("Hystricog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['hystricog'],
                    hand: ['pit-demon', 'hebe-the-huge']
                },
                player2: {
                    inPlay: ['bot-bookton']
                }
            });
        });

        it('should allow you to destroy damaged creatures', function () {
            this.player1.play(this.hebeTheHuge);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.clickCard(this.hystricog);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.hystricog);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            this.player1.clickCard(this.hystricog);
            expect(this.hystricog.location).toBe('discard');
        });

        it('should not allow you to destroy undamaged creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.clickCard(this.hystricog);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).not.toBeAbleToSelect(this.hystricog);
            expect(this.player1).not.toBeAbleToSelect(this.botBookton);
        });
    });
});
