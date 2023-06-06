describe('Gezrăhi Blacksmith', function () {
    describe("Gezrăhi Blacksmith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['gezrăhi-blacksmith']
                },
                player2: {}
            });
        });

        it('gives options at the start of turn for each player', function () {
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Select one');
            this.player2.clickPrompt('Draw a card');
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Select one');
        });

        it('lets the player draw a card', function () {
            this.player1.endTurn();
            let handSize = this.player2.hand.length;
            this.player2.clickPrompt('Draw a card');
            expect(this.player2.hand.length).toBe(handSize + 1);
        });

        it('lets the player make a token', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Draw a card');
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('Make a token creature');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('fizzles making a token if the player has no token', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Make a token creature');
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            this.player2.clickPrompt('untamed');
        });
    });
});
