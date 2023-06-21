describe('Warrior', function () {
    describe("Warrior's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'warrior',
                    amber: 2,
                    inPlay: ['warrior:brammo', 'krump']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub']
                }
            });
        });

        it('should not be able to reap when opponent has creatures in play', function () {
            this.player1.clickCard(this.warrior);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });

        it('should be able to reap when no opponent creatures in play', function () {
            this.player2.moveCard(this.gub, 'discard');
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });
});
