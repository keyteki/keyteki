describe("Snag's Mirror", function () {
    describe('action ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snag-s-mirror', 'krump', 'professor-sutterkin']
                },
                player2: {
                    inPlay: ['snufflegator', 'troll', 'brain-eater']
                }
            });
        });

        describe('when a house is chosen', function () {
            beforeEach(function () {
                this.player1.endTurn();

                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
            });

            it('should not allow the opponent to choose that house', function () {
                expect(this.player1).toHavePromptButton('logos');
                expect(this.player1).not.toHavePromptButton('brobnar');
            });

            describe('and a house is chosen by the other player', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('logos');
                    this.player1.endTurn();
                });

                it('should not let the other player choose that house', function () {
                    expect(this.player2).not.toHavePromptButton('logos');
                    expect(this.player2).toHavePromptButton('brobnar');
                    expect(this.player2).toHavePromptButton('untamed');
                });

                describe("and then snag's mirror goes away", function () {
                    beforeEach(function () {
                        this.player1.moveCard(this.snagSMirror, 'discard');
                        this.player2.clickPrompt('brobnar');
                        this.player2.endTurn();
                    });

                    it('should not restrict house choice anymore', function () {
                        expect(this.player1).toHavePromptButton('logos');
                        expect(this.player1).toHavePromptButton('brobnar');
                    });
                });
            });
        });
    });
});
