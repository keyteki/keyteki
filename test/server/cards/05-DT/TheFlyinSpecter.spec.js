describe('TheFlyinSpecter', function () {
    describe("TheFlyinSpecter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra', 'the-flyin--specter'],
                    hand: []
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        describe('while the tide is not high', function () {
            beforeEach(function () {
                this.player1.useAction(this.theFlyinSpecter);
            });

            it('should not steal 1A', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('while the tide is high and fight', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.useAction(this.theFlyinSpecter);
            });

            it('should steal 1A', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.raiseTide();
            });

            it('should destroy it', function () {
                expect(this.player2.chains).toBe(3);
                expect(this.theFlyinSpecter.location).toBe('discard');
            });
        });
    });
});
