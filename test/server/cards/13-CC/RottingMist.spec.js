describe('Rotting Mist', function () {
    describe("Rotting Mist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['rotting-mist'],
                    inPlay: ['flaxia', 'tunk']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'groke', 'john-smyth']
                }
            });
        });

        it('gives each enemy creature -1 power until the end of the turn', function () {
            this.player1.play(this.rottingMist);
            expect(this.flaxia.power).toBe(4); // Unchanged - friendly creature
            expect(this.tunk.power).toBe(6); // Unchanged - friendly creature
            expect(this.troll.power).toBe(7); // 8 - 1 = 7
            expect(this.dustPixie.location).toBe('discard'); // 1 - 1 = 0
            expect(this.groke.power).toBe(4); // 5 - 1 = 4
            expect(this.johnSmyth.power).toBe(1); // 2 - 1 = 1
        });

        it('effect wears off at the end of the turn', function () {
            this.player1.play(this.rottingMist);
            expect(this.troll.power).toBe(7); // 8 - 1 = 7
            expect(this.groke.power).toBe(4); // 5 - 1 = 4
            this.player1.endTurn();
            expect(this.troll.power).toBe(8); // Back to normal
            expect(this.groke.power).toBe(5); // Back to normal
        });

        it('does not affect friendly creatures', function () {
            this.player1.play(this.rottingMist);
            expect(this.flaxia.power).toBe(4); // Unchanged
            expect(this.tunk.power).toBe(6); // Unchanged
            this.player1.endTurn();
            expect(this.flaxia.power).toBe(4); // Still unchanged
            expect(this.tunk.power).toBe(6); // Still unchanged
        });
    });
});
