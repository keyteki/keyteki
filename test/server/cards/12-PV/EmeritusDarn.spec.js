describe('Emeritus Darn', function () {
    describe("Emeritus Darn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['emeritus-darn'],
                    discard: ['searine', 'draining-touch', 'helper-bot']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump']
                }
            });

            this.player1.player.deck = [];
            this.player1.moveCard(this.searine, 'deck');
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.moveCard(this.helperBot, 'deck');
        });

        it('should archive the top 2 cards of the deck when reaping', function () {
            this.player1.reap(this.emeritusDarn);
            expect(this.searine.location).toBe('deck');
            expect(this.drainingTouch.location).toBe('archives');
            expect(this.helperBot.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive fewer cards if deck has less than 2 cards', function () {
            this.player1.moveCard(this.drainingTouch, 'discard');
            this.player1.moveCard(this.helperBot, 'discard');
            this.player1.reap(this.emeritusDarn);
            expect(this.searine.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
