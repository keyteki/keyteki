describe('Connectome Transfer', function () {
    describe("Connectome Transfer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['connectome-transfer'],
                    inPlay: ['helper-bot', 'archimedes', 'ronnie-wristclocks']
                },
                player2: {
                    hand: ['scowly-caper'],
                    inPlay: ['lamindra']
                }
            });
        });

        it('archives flank creatures', function () {
            this.player1.play(this.connectomeTransfer);
            expect(this.helperBot.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.helperBot);
            expect(this.ronnieWristclocks.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.ronnieWristclocks);
            expect(this.archimedes.location).toBe('play area');
            expect(this.lamindra.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('archives creatures in owner archives', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.scowlyCaper);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.connectomeTransfer);
            expect(this.helperBot.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.helperBot);
            expect(this.ronnieWristclocks.location).toBe('play area');
            expect(this.archimedes.location).toBe('play area');
            expect(this.lamindra.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.lamindra);
            expect(this.scowlyCaper.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.scowlyCaper);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
