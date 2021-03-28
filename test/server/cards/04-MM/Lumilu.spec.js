describe('Lumilu', function () {
    describe("Lumilu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: [
                        'lumilu',
                        'flaxia',
                        'bumblebird',
                        'ancient-bear',
                        'buzzle',
                        'floomf',
                        'harmonia',
                        'dharna'
                    ],
                    hand: ['eldest-bear'],
                    amber: 1
                },
                player2: {
                    amber: 1,
                    inPlay: ['tantadlin', 'archimedes', 'code-monkey']
                }
            });
        });

        it('should gain 1A for each friendly Beast', function () {
            this.player1.reap(this.lumilu);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(1);
        });
    });
});
