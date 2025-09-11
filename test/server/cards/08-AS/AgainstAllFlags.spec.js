describe('Against All Flags', function () {
    describe("Against All Flags's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['against-all-flags'],
                    inPlay: ['dust-pixie', 'hunting-witch', 'bosun-creen']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'groke', 'medic-ingram']
                }
            });
        });

        it('should steal 1 if all unique houses among flank creatures', function () {
            this.player1.play(this.againstAllFlags);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2 if at least one house shared among flank creatures', function () {
            this.medicIngram.enhancements = ['untamed'];
            this.player1.play(this.againstAllFlags);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });
    });
});
