describe('SlimyJark(WC)', function () {
    describe('Slimy Jark fight to enrage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['slimy-jark']
                },
                player2: {
                    inPlay: ['nexus']
                }
            });
        });

        it('enrages what slimy jark fights', function () {
            this.player1.fightWith(this.slimyJark, this.nexus);
            expect(this.nexus.tokens.enrage).toBe(1);
            expect(this).toHaveRecentChatMessage('player1 uses Slimy Jark to enrage Nexus');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.nexus);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
        });
    });
});
