describe('Wild Grumpus', function () {
    describe("Wild Grumpus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['wild-grumpus', 'troll'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'snufflegator']
                }
            });
        });

        it('should gain skirmish while on a flank', function () {
            this.player1.playCreature(this.wildGrumpus);
            expect(this.wildGrumpus.hasKeyword('skirmish')).toBe(true);
            expect(this.wildGrumpus.hasKeyword('taunt')).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain taunt while not on a flank', function () {
            this.player1.playCreature(this.wildGrumpus);
            this.player1.playCreature(this.troll);
            expect(this.wildGrumpus.hasKeyword('taunt')).toBe(true);
            expect(this.wildGrumpus.hasKeyword('skirmish')).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
