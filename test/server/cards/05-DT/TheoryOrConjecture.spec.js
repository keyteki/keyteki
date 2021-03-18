describe('TheoryOrConjecture', function () {
    describe("TheoryOrConjecture's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['theory-or-conjecture', 'dextre', 'foggify']
                }
            });
            this.player1.moveCard('dextre', 'deck');
            this.player1.moveCard('foggify', 'deck');
        });

        describe('when its played', function () {
            beforeEach(function () {
                this.player1.play(this.theoryOrConjecture);
            });

            describe('select archive', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Archive top 2 cards');
                });

                it('play then archive 2 cards', function () {
                    expect(this.foggify.location).toBe('archives');
                    expect(this.dextre.location).toBe('archives');
                });
            });
            describe('select play', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Play top card');
                });

                it('play then play top card', function () {
                    expect(this.foggify.location).toBe('discard');
                    expect(this.dextre.location).toBe('deck');
                });
            });
        });
    });
});
