describe('Congregate', function () {
    describe("Congregate's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'blypyp', 'krump'],
                    hand: ['congregate']
                },
                player2: {
                    inPlay: ['dust-pixie', 'borka-rikk']
                }
            });
        });

        it('should gain 2 amber when there are 2 or more friendly creatures with the chosen trait', function () {
            this.player1.play(this.congregate);
            this.player1.selectTrait('giant');

            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber when there are less than 2 friendly creatures with the chosen trait', function () {
            this.player1.play(this.congregate);
            this.player1.selectTrait('martian');

            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
