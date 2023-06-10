describe('Knightapult', function () {
    describe('action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    inPlay: ['chelonia', 'flaxia', 'knightapult'],
                    hand: ['holdfast', 'berinon']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });

            this.player1.useAction(this.knightapult);
        });

        describe('should cause the next creature played', function () {
            beforeEach(function () {
                this.player1.clickCard(this.holdfast);
                this.player1.clickPrompt('Play this creature');
            });

            it('to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).toHavePromptButton('Deploy Left');
                expect(this.player1).toHavePromptButton('Deploy Right');
            });

            it('to be ready', function () {
                this.player1.clickPrompt('Deploy Left');
                this.player1.clickCard(this.flaxia);

                expect(this.holdfast.exhausted).toBe(false);
            });
        });
        describe('should cause the 2nd next creature played', function () {
            beforeEach(function () {
                this.player1.play(this.holdfast);
                this.player1.clickCard(this.berinon);
                this.player1.clickPrompt('Play this creature');
            });

            it('not to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).not.toHavePromptButton('Deploy Left');
                expect(this.player1).not.toHavePromptButton('Deploy Right');
            });

            it('not to be ready', function () {
                this.player1.clickPrompt('Left');

                expect(this.berinon.exhausted).toBe(true);
            });
        });
    });

    it("should cause Gebuk's replacement to be deployable and ready");

    it('should cause token creatures to be deployable and ready');
});
