describe('Stealth Mode', function () {
    describe("Stealth Mode's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['stealth-mode']
                },
                player2: {
                    hand: ['virtuous-works', 'sequis', 'gorm-of-omm', 'shoulder-armor']
                }
            });
        });

        it('should stop the opponent playing actions, but let them play other cards', function () {
            this.player1.play(this.stealthMode);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.clickCard(this.virtuousWorks);
            expect(this.player2).not.toHavePrompt('Play this action');
            this.player2.clickPrompt('Cancel');
            this.player2.play(this.sequis);
            expect(this.sequis.location).toBe('play area');
            this.player2.play(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('play area');
            this.player2.playUpgrade(this.shoulderArmor, this.sequis);
            expect(this.shoulderArmor.location).toBe('play area');
        });
    });
});
