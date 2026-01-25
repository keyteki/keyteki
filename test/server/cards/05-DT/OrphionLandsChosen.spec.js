describe('OrphionLandsChosen', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['orphion-land-s-chosen']
                },
                player2: {
                    amber: 2
                }
            });
        });

        describe('in high tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should not gain armor', function () {
                expect(this.orphionLandSChosen.armor).toBe(0);
            });

            describe('and reaps', function () {
                beforeEach(function () {
                    this.player1.reap(this.orphionLandSChosen);
                });

                it('should not capture', function () {
                    expect(this.player2.amber).toBe(2);
                    expect(this.orphionLandSChosen.amber).toBe(0);
                });
            });
        });

        describe('in low tide', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should gain 3 armor', function () {
                expect(this.orphionLandSChosen.armor).toBe(3);
            });

            describe('and reaps', function () {
                beforeEach(function () {
                    this.player1.reap(this.orphionLandSChosen);
                });

                it('should capture 2', function () {
                    expect(this.player2.amber).toBe(0);
                    expect(this.orphionLandSChosen.amber).toBe(2);
                });
            });
        });
    });
});
