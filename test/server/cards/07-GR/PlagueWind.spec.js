describe('Plague Wind', function () {
    describe("Plague Wind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['plague-wind'],
                    inPlay: ['flaxia', 'phloxem-spewer', 'tunk']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'groke', 'john-smyth']
                }
            });
        });

        it('gives each non-Mars creature -3 power until the end of the turn', function () {
            this.player1.play(this.plagueWind);
            expect(this.flaxia.power).toBe(1);
            expect(this.phloxemSpewer.power).toBe(2);
            expect(this.tunk.power).toBe(6);
            expect(this.troll.power).toBe(5);
            expect(this.groke.power).toBe(2);
            expect(this.johnSmyth.power).toBe(2);
            expect(this.dustPixie.location).toBe('discard');
            this.player1.endTurn();
            expect(this.flaxia.power).toBe(4);
            expect(this.phloxemSpewer.power).toBe(2);
            expect(this.tunk.power).toBe(6);
            expect(this.troll.power).toBe(8);
            expect(this.groke.power).toBe(5);
            expect(this.johnSmyth.power).toBe(2);
            expect(this.dustPixie.location).toBe('discard');
        });
    });
});
