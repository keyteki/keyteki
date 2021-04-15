describe('Dr. Verokter', function () {
    describe("Dr. Verokter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['dr-verokter'],
                    discard: ['way-of-the-wolf', 'bad-penny', 'key-charge', 'animator']
                }
            });
        });

        describe('when it reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.drVerokter);
            });

            it('should be able to select upgardes and actions but not creatures or artifacts from discard', function () {
                expect(this.player1).toBeAbleToSelect(this.wayOfTheWolf);
                expect(this.player1).toBeAbleToSelect(this.keyCharge);
                expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                expect(this.player1).not.toBeAbleToSelect(this.animator);
            });

            describe('selects upgrade', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.wayOfTheWolf);
                });

                it('return to deck', function () {
                    expect(this.wayOfTheWolf.location).toBe('deck');
                    expect(this.keyCharge.location).toBe('discard');
                    expect(this.badPenny.location).toBe('discard');
                    expect(this.animator.location).toBe('discard');
                });
            });

            describe('selects action', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.keyCharge);
                });

                it('return to deck', function () {
                    expect(this.wayOfTheWolf.location).toBe('discard');
                    expect(this.keyCharge.location).toBe('deck');
                    expect(this.badPenny.location).toBe('discard');
                    expect(this.animator.location).toBe('discard');
                });
            });
        });
    });
});
