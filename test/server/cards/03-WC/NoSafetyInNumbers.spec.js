describe('No Safety in Numbers', function () {
    describe("No Safety in Numbers's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll', 'krump'],
                    hand: ['no-safety-in-numbers']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'shooler'],
                    hand: ['gub']
                }
            });
        });

        it('should not deal damage to any creature', function () {
            this.player1.play(this.noSafetyInNumbers);

            expect(this.troll.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.lamindra.damage).toBe(0);
            expect(this.shooler.damage).toBe(0);
        });
    });

    describe("No Safety in Numbers's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll', 'krump', 'groggins', 'dodger'],
                    hand: ['no-safety-in-numbers']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'shooler', 'redlock', 'gub', 'faygin'],
                    hand: ['snudge']
                }
            });
        });

        it('should deal 3 damage to Brobnar and Shadows', function () {
            this.player1.play(this.noSafetyInNumbers);

            expect(this.troll.damage).toBe(3);
            expect(this.krump.damage).toBe(3);
            expect(this.groggins.damage).toBe(3);
            expect(this.dodger.damage).toBe(3);
            expect(this.lamindra.location).toBe('discard');
            expect(this.redlock.location).toBe('discard');
            expect(this.faygin.location).toBe('discard');
            expect(this.gub.damage).toBe(0);
            expect(this.shooler.damage).toBe(0);
        });
    });
});
