describe('Snaglet', function () {
    describe('action ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    inPlay: ['snaglet']
                },
                player2: {
                    amber: 2,
                    inPlay: ['snufflegator', 'troll']
                }
            });
        });

        describe('when the action is triggered', function () {
            beforeEach(function () {
                this.player1.useAction(this.snaglet);
            });

            it('should allow a house to be selected', function () {
                expect(this.player1).toHavePromptButton('logos');
                expect(this.player1).toHavePromptButton('brobnar');
            });

            describe('and a house is chosen and the opponent chooses that house', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('brobnar');
                    this.player1.endTurn();

                    this.player2.clickPrompt('brobnar');
                });

                it('should cause 2 amber to be stolen', function () {
                    expect(this.player1.amber).toBe(6);
                    expect(this.player2.amber).toBe(0);
                });
            });

            describe('and a house is chosen and the opponent does not choose that house', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('brobnar');
                    this.player1.endTurn();

                    this.player2.clickPrompt('untamed');
                });

                it('should not cause 2 amber to be stolen', function () {
                    expect(this.player1.amber).toBe(4);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });
    });
});
