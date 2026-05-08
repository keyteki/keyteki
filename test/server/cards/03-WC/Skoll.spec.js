describe('Sköll', function () {
    describe('Sköll assault destroy trigger', function () {
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
            expect(this.troll.powerCounters).toBe(1);
            this.player1.endTurn();
        });

        it("doesn't place power on troll after killing Valdr with power", function () {
            this.player1.fightWith(this.sköll, this.valdr);
            expect(this.valdr.location).toBe('discard');
            expect(this.sköll.location).toBe('discard');
            expect(this.troll.powerCounters).toBe(0);
            this.player1.endTurn();
        });
    });
});
