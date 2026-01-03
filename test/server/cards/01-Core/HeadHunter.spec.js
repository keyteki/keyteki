describe('Headhunter', function () {
    describe("Headhunter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['headhunter']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should gain 1 amber after fighting', function () {
            this.player1.fightWith(this.headhunter, this.emberImp);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
