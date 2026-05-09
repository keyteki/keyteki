describe('Roxador', function () {
    describe("Roxador's fight ability and damage limit", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['roxador']
                },
                player2: {
                    inPlay: ['krump', 'troll', 'bumpsy']
                }
            });
        });

        it('only deals 2 damage when fighting and stuns only the attacked creature, not its neighbors', function () {
            this.player1.fightWith(this.roxador, this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.troll.stunned).toBe(true);
            expect(this.krump.stunned).toBe(false);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.roxador.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
