describe('The Ulfberht Device', function () {
    describe("The Ulfberht Device's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'tantadlin', 'ancient-bear', 'archimedes'],
                    hand: ['the-ulfberht-device']
                },
                player2: {
                    amber: 2,
                    inPlay: ['sensor-chief-garcia', 'helper-bot', 'flaxia']
                }
            });
        });

        it('while not in play, each player can repeat the house chosen', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
        });

        describe('when in play', function () {
            beforeEach(function () {
                this.player1.play(this.theUlfberhtDevice);
            });

            it('should not allow the same house to be chosen', function () {
                this.player1.endTurn();

                expect(this.player2).toHavePromptButton('untamed');
                expect(this.player2).toHavePromptButton('logos');
                expect(this.player2).not.toHavePromptButton('staralliance');
                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).not.toHavePromptButton('staralliance');
                expect(this.player1).toHavePromptButton('logos');
                expect(this.player1).toHavePromptButton('untamed');
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();

                expect(this.player2).not.toHavePromptButton('logos');
                expect(this.player2).toHavePromptButton('untamed');
                expect(this.player2).toHavePromptButton('staralliance');
                this.player2.clickPrompt('staralliance');
                this.player2.endTurn();

                expect(this.player1).toHavePromptButton('staralliance');
                expect(this.player1).not.toHavePromptButton('untamed');
                expect(this.player1).toHavePromptButton('logos');
                this.player1.clickPrompt('staralliance');
                this.player1.endTurn();

                expect(this.player2).toHavePromptButton('logos');
                expect(this.player2).toHavePromptButton('untamed');
                expect(this.player2).not.toHavePromptButton('staralliance');
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();

                expect(this.player1).toHavePromptButton('untamed');
                expect(this.player1).toHavePromptButton('logos');
                expect(this.player1).not.toHavePromptButton('staralliance');
                this.player1.clickPrompt('logos');
                this.player1.endTurn();

                expect(this.player2).not.toHavePromptButton('untamed');
                expect(this.player2).toHavePromptButton('logos');
                expect(this.player2).toHavePromptButton('staralliance');
                this.player2.clickPrompt('staralliance');
                this.player2.endTurn();

                expect(this.player1).toHavePromptButton('staralliance');
                expect(this.player1).not.toHavePromptButton('logos');
                expect(this.player1).toHavePromptButton('untamed');
                this.player1.clickPrompt('staralliance');
                this.player1.endTurn();
            });
        });

        describe('after a player chooses a house and TUD leaves play', function () {
            beforeEach(function () {
                this.player1.play(this.theUlfberhtDevice);
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.moveCard(this.theUlfberhtDevice, 'discard');
                this.player1.endTurn();
            });

            it('should allow the same house to be chosen', function () {
                expect(this.player2).toHavePromptButton('untamed');
                expect(this.player2).toHavePromptButton('logos');
                expect(this.player2).toHavePromptButton('staralliance');

                this.player2.clickPrompt('logos');
                this.player2.endTurn();

                expect(this.player1).toHavePromptButton('staralliance');
                expect(this.player1).toHavePromptButton('logos');
                expect(this.player1).toHavePromptButton('untamed');

                this.player1.clickPrompt('untamed');
                this.player1.endTurn();
            });
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    hand: ['sensor-chief-garcia'],
                    inPlay: ['tachyon-manifold', 'the-ulfberht-device', 'shaffles']
                },
                player2: {
                    amber: 0,
                    inPlay: [],
                    hand: ['necromorph', 'azuretooth', 'shaffles']
                }
            });
            this.player1.clickPrompt('ekwidon');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect player's next turn", function () {
            this.player1.endTurn();
            expect(this.player1).not.toHavePromptButton('ekwidon');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('staralliance');
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).not.toHavePromptButton('staralliance');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('ekwidon');
            this.player2.clickPrompt('dis');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
