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
            expect(this.thingFromTheDeep.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.flaxia.tokens.damage).toBe(undefined);
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 1 damage to each enemy creature on scrap', function () {
            this.player1.scrap(this.boiler);
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.thingFromTheDeep.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
