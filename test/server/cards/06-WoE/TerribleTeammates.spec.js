describe('Terrible Teammates', function () {
    describe("Terrible Teammates's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    hand: ['terrible-teammates', 'keyfrog', 'key-abduction', 'mars-first'],
                    archives: ['witch-of-the-eye'],
                    inPlay: ['airlock', 'flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow selecting only non-mars cards from hand to discard', function () {
            this.player1.play(this.terribleTeammates);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.airlock);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).not.toBeAbleToSelect(this.keyAbduction);
            expect(this.player1).not.toBeAbleToSelect(this.marsFirst);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheEye);
            this.player1.clickCard(this.keyfrog);
            expect(this.keyfrog.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should allow you to discard nothing', function () {
            this.player1.play(this.terribleTeammates);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });
    });
});
