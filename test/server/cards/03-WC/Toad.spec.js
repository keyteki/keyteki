describe('Toad', function () {
    describe('Toad Behaviour', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['toad'],
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
            this.player1.clickCard(this.toad);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
        });
    });
});
