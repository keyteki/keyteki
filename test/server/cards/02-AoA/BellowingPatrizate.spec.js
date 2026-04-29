describe('Bellowing Patrizate', function () {
    describe("Bellowing Patrizate's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bellowing-patrizate'],
                    hand: ['groggins']
                },
                player2: {
                    inPlay: ['bigtwig', 'niffle-ape'],
                    hand: ['tantadlin']
                }
            });
        });

        it('should cause 1D to friendly creature when ready', function () {
            this.player1.play(this.groggins);
            expect(this.bellowingPatrizate.damage).toBe(0);
            expect(this.groggins.damage).toBe(1);
        });

        it('should not cause 1D to friendly creature when exhausted', function () {
            this.player1.reap(this.bellowingPatrizate);
            this.player1.play(this.groggins);
            expect(this.bellowingPatrizate.damage).toBe(0);
            expect(this.groggins.damage).toBe(0);
        });

        describe("on opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
            });

            it('should cause 1D to enemy creature when ready', function () {
                this.player2.play(this.tantadlin);
                expect(this.bellowingPatrizate.damage).toBe(0);
                expect(this.niffleApe.damage).toBe(0);
                expect(this.bigtwig.damage).toBe(0);
                expect(this.tantadlin.damage).toBe(1);
            });

            it('should not cause 1D to enemy creature when exhausted', function () {
                this.player2.reap(this.bigtwig);
                this.player2.clickCard(this.bellowingPatrizate);
                this.player2.play(this.tantadlin);
                expect(this.bellowingPatrizate.damage).toBe(0);
                expect(this.niffleApe.damage).toBe(0);
                expect(this.bigtwig.damage).toBe(0);
                expect(this.tantadlin.damage).toBe(0);
            });
        });
    });
});
