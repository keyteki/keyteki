describe('Soleft', function () {
    describe("Soleft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 4,
                    hand: ['draining-touch'],
                    inPlay: ['seabringer-kekoa', 'nexus', 'soleft']
                },
                player2: {
                    amber: 2,
                    token: 'trader',
                    inPlay: ['trader:batdrone', 'mother', 'helper-bot']
                }
            });
        });

        it('should destroy the left creature', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.soleft);
            expect(this.seabringerKekoa.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.trader.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Soleft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 4,
                    hand: ['draining-touch'],
                    inPlay: ['seabringer-kekoa', 'nexus', 'soleft']
                },
                player2: {
                    amber: 6,
                    inPlay: []
                }
            });
        });

        it('should do nothing with no opponent creatures', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.soleft);
            expect(this.seabringerKekoa.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
