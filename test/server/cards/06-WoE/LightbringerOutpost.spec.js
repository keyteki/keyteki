describe('Lightbringer Outpost', function () {
    describe("Lightbringer Outpost's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 2,
                    inPlay: ['chelonia', 'flaxia', 'lightbringer-outpost'],
                    hand: ['troll']
                },
                player2: {
                    amber: 5,
                    inPlay: ['urchin', 'valoocanth', 'floomf']
                }
            });
        });
    });
});
