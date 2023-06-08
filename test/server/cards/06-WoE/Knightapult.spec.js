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

            xit('to be ready', function () {
                expect(this.holdfast.exhausted).toBe(false);
            });
        });

        it('should only apply to the first creature played');
    });

    it("should cause Gebuk's replacement to be deployable and ready");

    it('should cause token creatures to be deployable and ready');
});
