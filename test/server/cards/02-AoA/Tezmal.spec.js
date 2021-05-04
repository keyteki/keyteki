describe('Tezmal', function () {
    describe("Tezmal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['tezmal']
                },
                player2: {
                    inPlay: ['doc-bookton', 'shooler', 'troll']
                }
            });
        });

        it('should block the opponent to pick a particular house', function () {
            this.player1.reap(this.tezmal);
            expect(this.player1).toHavePrompt('Tezmal');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('brobnar');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('logos');
            expect(this.player2).toHavePromptButton('brobnar');
        });
    });
});
