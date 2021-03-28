describe('Mogghunter(WC)', function () {
    describe('Mogghunter fight ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mogghunter']
                },
                player2: {
                    inPlay: ['looter-goblin', 'nexus', 'troll']
                }
            });
        });

        it('deal 2 damage to flank creature', function () {
            this.player1.fightWith(this.mogghunter, this.nexus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.looterGoblin);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.troll);
            expect(this.nexus.hasToken('damage')).toBe(false);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Mogghunter to deal 2 damage to Troll'
            );
        });
    });
});
