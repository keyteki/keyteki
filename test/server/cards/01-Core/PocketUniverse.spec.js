describe('Pocket Universe', function () {
    describe("Pocket Universe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'logos',
                    inPlay: ['pocket-universe']
                },
                player2: {}
            });
        });

        it('should force spending amber from Pocket Universe if needed to forge a key', function () {
            this.player1.clickCard(this.pocketUniverse);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(5);
            expect(this.pocketUniverse.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('Logos');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.pocketUniverse.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow choosing amount of amber to spend from Pocket Universe to forge a key', function () {
            this.player1.amber = 6;
            this.pocketUniverse.tokens.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('1');
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('Logos');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.pocketUniverse.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
