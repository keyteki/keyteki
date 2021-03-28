describe('We Can ALL Win', function () {
    describe("We Can ALL Win's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 5,
                    inPlay: ['lamindra'],
                    hand: ['we-can-all-win', 'spartasaur', 'saurus-rex']
                },
                player2: {
                    amber: 9,
                    inPlay: ['shooler']
                }
            });
        });

        it('both players should forge at -2A cost', function () {
            this.player1.play(this.weCanAllWin);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(5);
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(2);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
