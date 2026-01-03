describe('Mind Your Elders', function () {
    describe("Mind Your Elders's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zorg', 'john-smyth'],
                    hand: ['mind-your-elders']
                },
                player2: {
                    inPlay: ['zorg'],
                    discard: ['commander-remiel', 'troll']
                }
            });
        });

        it('should capture 3 amber when there are more friendly Mars creatures', function () {
            this.player2.amber = 3;
            this.player1.play(this.mindYourElders);
            expect(this.player1).toHavePrompt('Mind Your Elders');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            this.player1.clickCard(this.zorg);
            expect(this.player2.amber).toBe(0);
            expect(this.zorg.tokens.amber).toBe(3);
        });

        it('should not capture amber when there are not more friendly Mars creatures', function () {
            this.player2.amber = 3;
            this.player2.moveCard(this.zorg, 'discard');
            this.player1.play(this.mindYourElders);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player2.amber).toBe(3);
            expect(this.zorg.tokens.amber).toBeUndefined();
        });

        it('should only count Mars creatures when determining if there are more friendly Mars creatures', function () {
            this.player2.amber = 3;
            this.player2.moveCard(this.commanderRemiel, 'play area');
            this.player2.moveCard(this.troll, 'play area');
            this.player1.play(this.mindYourElders);
            expect(this.player1).toHavePrompt('Mind Your Elders');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.zorg);
            expect(this.player2.amber).toBe(0);
            expect(this.zorg.tokens.amber).toBe(3);
        });

        it('should not capture amber when there are equal numbers of Mars creatures', function () {
            this.player2.amber = 3;
            this.player1.moveCard(this.johnSmyth, 'discard');
            this.player1.play(this.mindYourElders);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player2.amber).toBe(3);
            expect(this.zorg.tokens.amber).toBeUndefined();
        });
    });
});
