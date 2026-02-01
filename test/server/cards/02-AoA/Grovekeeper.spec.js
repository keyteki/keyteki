describe('Grovekeeper', function () {
    describe("Grovekeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dust-pixie', 'grovekeeper', 'flaxia']
                },
                player2: {}
            });
        });

        it('should give each neighboring creature a +1 power counter at end of turn', function () {
            this.player1.endTurn();

            expect(this.dustPixie.tokens.power).toBe(1);
            expect(this.flaxia.tokens.power).toBe(1);
            expect(this.grovekeeper.tokens.power).toBeUndefined();
            expect(this.player2).hasPrompt('Choose which house you want to activate this turn');
        });
    });
});
