describe('Strange Ordination', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    hand: ['strange-ordination']
                },
                player2: {
                    amber: 2,
                    inPlay: ['brain-eater', 'dextre', 'daughter'],
                    hand: ['mother']
                }
            });
        });

        it('should not be allowed to play', function () {
            this.player1.clickCard(this.strangeOrdination);
            expect(this.player1).not.toHavePromptButton('Play this action');
            expect(this.player1).toHavePromptButton('Discard this card');
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not be allowed to play', function () {
                this.player1.clickCard(this.strangeOrdination);
                expect(this.player1).not.toHavePromptButton('Play this action');
                expect(this.player1).toHavePromptButton('Discard this card');
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should be allowed to play the card', function () {
                this.player1.clickCard(this.strangeOrdination);
                expect(this.player1).toHavePromptButton('Play this action');
                expect(this.player1).toHavePromptButton('Discard this card');
            });

            it('should be allowed to play the card', function () {
                this.player1.play(this.strangeOrdination);
                expect(this.player1.amber).toBe(4);
            });
        });
    });
});
