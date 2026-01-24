describe('Shorty', function () {
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
            this.player1.reap(this.shorty);
            expect(this.shorty.tokens.enrage).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickCard(this.shorty);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should remove enrage after killing by assault', function () {
            this.shorty.enrage();
            this.player1.fightWith(this.shorty, this.nexus);
            expect(this.shorty.damage).toBe(0);
            expect(this.shorty.enraged).toBe(false);
            expect(this.nexus.location).toBe('discard');
        });
    });
});
