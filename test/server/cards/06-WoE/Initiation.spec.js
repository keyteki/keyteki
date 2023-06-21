describe('Initiation', function () {
    describe("Initiation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['earthshaker'],
                    hand: [
                        'stir-crazy',
                        'stir-crazy',
                        'stir-crazy',
                        'seabringer-kekoa',
                        'initiation',
                        'ged-hammer'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'mother'],
                    discard: ['helper-bot', 'archimedes', 'eureka']
                }
            });

            this.player1.moveCard(this.gedHammer, 'deck');
        });

        it('should make a token creature and not archive when hand is 4 or more', function () {
            this.player1.play(this.initiation);
            this.player1.clickPrompt('Right');
            expect(this.initiation.location).toBe('discard');
            expect(this.gedHammer.location).toBe('play area');
            expect(this.gedHammer.name).toBe('Grumpus');
            this.player1.endTurn();
        });

        it('should make a token creature and archive when hand less than 4', function () {
            this.player1.play(this.seabringerKekoa);
            this.player1.play(this.initiation);
            this.player1.clickPrompt('Right');
            expect(this.initiation.location).toBe('archives');
            expect(this.gedHammer.location).toBe('play area');
            expect(this.gedHammer.name).toBe('Grumpus');
            this.player1.endTurn();
        });
    });
});
