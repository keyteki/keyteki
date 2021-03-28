describe('Imp-losion', function () {
    describe("Imp-losion's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['envy', 'pride', 'wrath', 'lamindra', 'gub'],
                    hand: ['imp-losion']
                },
                player2: {
                    inPlay: ['desire', 'troll']
                }
            });
        });

        it('should destroy one friendly and one enemy creature', function () {
            this.player1.play(this.impLosion);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.troll);
            expect(this.gub.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
        });
    });
});
