describe('Tentaclid', function () {
    describe('Tentaclid Behaviour', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'unfathomable',
                    inPlay: ['tentaclid'],
                    hand: ['fertility-chant']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus'],
                    hand: ['ghostly-hand', 'nexus']
                }
            });
        });

        it('should not be able to reap', function () {
            this.player1.clickCard(this.tentaclid);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
        });
    });
});
