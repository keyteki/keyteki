describe('Ethereal Adaptor', function () {
    describe("Ethereal Adaptor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'geistoid',
                    inPlay: ['troll'],
                    hand: ['ethereal-adaptor']
                },
                player2: {
                    inPlay: ['the-sting']
                }
            });

            this.player1.playUpgrade(this.etherealAdaptor, this.troll);
            this.troll.amber = 3;
        });

        it('should prompt the forge key prompt', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            expect(this.player1).toHavePrompt('How much amber do you want to spend from Troll?');
            expect(this.player1).toHavePromptButton(1);
            expect(this.player1).toHavePromptButton(2);
            expect(this.player1).toHavePromptButton(3);
            this.player1.clickPrompt(1);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.troll.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
            this.player1.clickPrompt('geistoid');
        });
    });
});
