describe('Inky Gloom', function () {
    describe("Inky Gloom's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['flaxia', 'bad-penny'],
                    hand: ['inky-gloom']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('Opponent cannot reap for one turn', function () {
            this.player1.play(this.inkyGloom);
            this.player1.reap(this.badPenny);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');

            this.player2.clickCard('lamindra');
            expect(this.player2).toHavePrompt('Choose an ability:');
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            this.player1.clickPrompt('untamed');
            this.player1.reap(this.flaxia);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.reap(this.lamindra);
        });
    });
});
