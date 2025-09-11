describe('Zeff "Punch" Yardus', function () {
    describe("Zeff 'Punch' Yardus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['zeff-punch-yardus'],
                    discard: ['searine', 'draining-touch', 'helper-bot', 'troll']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump']
                }
            });
        });

        it('should archive the top card of deck and discard pile after reaping', function () {
            this.player1.moveCard(this.searine, 'deck');
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.reap(this.zeffPunchYardus);
            expect(this.searine.location).toBe('deck');
            expect(this.helperBot.location).toBe('archives');
            expect(this.drainingTouch.location).toBe('archives');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with no discard pile', function () {
            this.player1.moveCard(this.searine, 'deck');
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.moveCard(this.helperBot, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.reap(this.zeffPunchYardus);
            expect(this.searine.location).toBe('deck');
            expect(this.helperBot.location).toBe('deck');
            expect(this.drainingTouch.location).toBe('deck');
            expect(this.troll.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
