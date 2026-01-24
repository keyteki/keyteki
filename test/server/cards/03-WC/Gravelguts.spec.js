describe('Gravelguts', function () {
    describe("Gravelguts's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    inPlay: ['mugwump', 'gravelguts', 'foozle', 'troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'brend-the-fanatic', 'silvertooth']
                }
            });
        });

        it('should gain 2 +1 power counters when it destroys a creature in a fight', function () {
            this.player1.fightWith(this.gravelguts, this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.gravelguts.damage).toBe(2);
            expect(this.gravelguts.powerCounters).toBe(2);
        });

        it('should gain 2 +1 power counters when it destroys defending a creature during a fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.gravelguts);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.gravelguts.damage).toBe(2);
            expect(this.gravelguts.powerCounters).toBe(2);
        });
    });
});
