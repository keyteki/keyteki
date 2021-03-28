describe('Veylan Analyst', function () {
    describe("Veylan Analyst's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['veylan-analyst', 'library-of-babble']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should trigger when using an artifact', function () {
            this.player1.clickCard(this.libraryOfBabble);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(1);
        });

        it('should not trigger under ABC circumstances', function () {});

        it('should have DEF effect on GHI', function () {});
    });
});
