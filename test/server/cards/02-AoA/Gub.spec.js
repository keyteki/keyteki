describe('Gub', function () {
    describe("Gub's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['gub']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should have base power when on flank', function () {
            expect(this.gub.power).toBe(1);
            expect(this.gub.getKeywordValue('taunt')).toBe(0);
        });

        it('should get +5 power and taunt when not on flank', function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zorg', 'gub', 'john-smyth']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });

            expect(this.gub.power).toBe(6);
            expect(this.gub.getKeywordValue('taunt')).toBe(1);
        });
    });
});
