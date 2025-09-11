describe('Wurm Tunnel', function () {
    describe("Wurm Tunnel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['wurm-tunnel'],
                    inPlay: ['gub', 'helper-bot']
                },
                player2: {
                    amber: 1,
                    inPlay: ['charette']
                }
            });

            this.gub.amber = 1;
            this.charette.amber = 3;
        });

        it('should move an amber to common supply from friendly creature and draw 2 cards', function () {
            this.player1.play(this.wurmTunnel);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.gub);
            expect(this.gub.amber).toBe(0);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move an amber to common supply from enemy creature and draw 2 cards', function () {
            this.player1.play(this.wurmTunnel);
            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not draw cards if no amber was removed', function () {
            this.player1.play(this.wurmTunnel);
            this.player1.clickCard(this.helperBot);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
