describe('Shorty(WC)', function () {
    describe('Shorty reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['shorty']
                },
                player2: {
                    inPlay: ['looter-goblin', 'nexus', 'troll']
                }
            });
        });

        it('shorty is enraged after reaping', function () {
            this.player1.clickCard(this.shorty);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.shorty.tokens.enrage).toBe(1);
            expect(this).toHaveRecentChatMessage('player1 uses Shorty to enrage Shorty');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickCard(this.shorty);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
    });
});
