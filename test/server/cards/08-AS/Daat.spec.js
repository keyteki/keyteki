describe('Daat', function () {
    describe("Daat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['daat'],
                    inPlay: ['ancient-bear', 'shooler']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should change active house on play', function () {
            this.player1.play(this.daat);
            expect(this.player1).toHavePrompt('Daat');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('mars');
            expect(this.player1).toHavePromptButton('sanctum');
            expect(this.player1).toHavePromptButton('shadows');
            expect(this.player1).toHavePromptButton('untamed');
            expect(this.player1).toHavePromptButton('staralliance');
            expect(this.player1).toHavePromptButton('saurian');
            expect(this.player1).toHavePromptButton('ekwidon');
            expect(this.player1).toHavePromptButton('geistoid');
            expect(this.player1).toHavePromptButton('skyborn');
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.ancientBear);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.shooler);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
