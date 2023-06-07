describe('Knightapult', function () {
    describe("Knightapult's action", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    inPlay: ['chelonia', 'knightapult'],
                    hand: ['holdfast']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
        });
    });
});
