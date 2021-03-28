describe('Skoll(WC)', function () {
    describe('Skoll assault destroy trigger', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['sköll', 'troll']
                },
                player2: {
                    inPlay: ['nexus', 'valdr']
                }
            });
        });

        it('places +1 on troll after killing nexus with assault', function () {
            this.player1.fightWith(this.sköll, this.nexus);
            this.player1.clickCard(this.troll);
            expect(this.nexus.location).toBe('discard');
            expect(this.troll.tokens.power).toBe(1);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Sköll to place 1 +1 power counter on Troll'
            );
        });

        it("doesn't place power on troll after killing valdr with power", function () {
            this.player1.fightWith(this.sköll, this.valdr);
            this.player1.clickCard(this.troll);
            expect(this.valdr.location).toBe('discard');
            expect(this.troll.tokens.power).toBe(undefined);
        });
    });
});
