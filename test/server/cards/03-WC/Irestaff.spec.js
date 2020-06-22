describe('Irestaff(WC)', function () {
    describe('Play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    inPlay: ['irestaff', 'troll']
                },
                player2: {
                    inPlay: ['umbra', 'nexus']
                }
            });
        });

        it('enrages and gives +1 counter to creature', function () {
            this.player1.clickCard(this.irestaff);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.troll);
            expect(this.troll.power).toBe(9);
            expect(this.troll.tokens.power).toBe(1);
            expect(this.troll.tokens.enrage).toBe(1);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Irestaff to enrage and add a +1 power counter to Troll'
            );
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');

            // enrage goes away after a fight
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.umbra);
            expect(this.troll.hasToken('enrage')).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });
});
