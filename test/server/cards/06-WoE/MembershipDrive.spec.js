describe('Membership Drive', function () {
    describe("Membership Drive's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    token: 'disciple',
                    inPlay: ['earthshaker'],
                    hand: ['membership-drive', 'holdfast', 'troll']
                },
                player2: {
                    amber: 4,
                    token: 'disciple',
                    inPlay: ['batdrone', 'mother'],
                    discard: ['helper-bot', 'archimedes', 'eureka']
                }
            });

            this.player1.moveCard(this.holdfast, 'deck');
        });

        it('should make a token creature gain 1 amber for each friendly token', function () {
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.play(this.membershipDrive);
            this.player1.clickPrompt('Right');
            expect(this.player1.amber).toBe(7);
            this.player1.endTurn();
        });

        it('should not grant amber for enemy tokens', function () {
            this.player2.makeTokenCreature();
            this.player1.play(this.membershipDrive);
            this.player1.clickPrompt('Right');
            expect(this.player1.amber).toBe(4);
            this.player1.endTurn();
        });
    });
});
