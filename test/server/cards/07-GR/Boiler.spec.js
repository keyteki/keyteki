describe('Boiler', function () {
    describe("Boiler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['boiler'],
                    inPlay: ['flaxia']
                },
                player2: {
                    inPlay: ['cpo-zytar', 'thing-from-the-deep', 'troll']
                }
            });
        });

        it('deals 6 damage to enemy flank creatures when destroyed', function () {
            this.player1.play(this.boiler);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.boiler);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.thingFromTheDeep.damage).toBe(2);
            expect(this.troll.damage).toBe(6);
            expect(this.flaxia.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 1 damage to each enemy creature on scrap', function () {
            this.player1.scrap(this.boiler);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.thingFromTheDeep.damage).toBe(1);
            expect(this.troll.damage).toBe(1);
            expect(this.flaxia.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
