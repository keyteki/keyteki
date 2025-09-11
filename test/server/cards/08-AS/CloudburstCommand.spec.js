describe('Cloudburst Command', function () {
    describe("Cloudburst Command's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 9,
                    house: 'skyborn',
                    inPlay: ['cloudburst-command', 'bux-bastian', 'gub'],
                    hand: ['bosun-creen']
                },
                player2: {
                    amber: 12,
                    inPlay: ['third-of-cliff']
                }
            });
        });

        it('should increase cost for a single Skyborn flank creature', function () {
            this.player1.endTurn();

            // Forge for 8.
            this.player2.clickPrompt('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(4);
        });

        it('should increase cost for each Skyborn flank creature', function () {
            this.player1.playCreature(this.bosunCreen);
            this.player1.endTurn();

            // Forge for 9.
            this.player2.clickPrompt('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(3);
        });

        it('should not affect own key cost', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Yellow');
            this.player2.clickPrompt('skyborn');
            this.player2.endTurn();

            // Forge for 6.
            this.player1.clickPrompt('Yellow');
            expect(this.player1.player.keys.yellow).toBe(true);
            expect(this.player1.player.amber).toBe(3);
        });
    });
});
