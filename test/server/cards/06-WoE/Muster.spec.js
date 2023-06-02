describe('Initiation', function () {
    describe("Initiation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    token: 'disciple',
                    inPlay: ['earthshaker'],
                    hand: ['muster', 'holdfast']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone', 'mother'],
                    discard: ['helper-bot', 'archimedes', 'eureka']
                }
            });

            this.player1.moveCard(this.holdfast, 'deck');
        });

        it('should make a token creature and archive when opponent has more amber', function () {
            this.player1.play(this.muster);
            this.player1.clickPrompt('Right');
            expect(this.muster.location).toBe('archives');
            expect(this.holdfast.location).toBe('play area');
            expect(this.holdfast.name).toBe('Disciple');
            this.player1.endTurn();
        });

        it('should make a token creature and not archive when opponent does not have more amber', function () {
            this.player1.amber = 4;
            this.player1.play(this.muster);
            this.player1.clickPrompt('Right');
            expect(this.muster.location).toBe('discard');
            expect(this.holdfast.location).toBe('play area');
            expect(this.holdfast.name).toBe('Disciple');
            this.player1.endTurn();
        });
    });
});
