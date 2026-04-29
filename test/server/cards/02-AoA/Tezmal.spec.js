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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'tezmal']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['hunting-witch', 'batdrone']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'dis');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.reap(this.tezmal);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('logos');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
