describe('OrphielSeasChosen', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['orphiel-sea-s-chosen']
                },
                player2: {
                    inPlay: ['bad-penny'],
                    amber: 2
                }
            });
        });

        describe('in high tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should gain skirmish', function () {
                expect(this.orphielSeaSChosen.getKeywordValue('skirmish')).toBe(1);
            });

            describe('and fights', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.orphielSeaSChosen, this.badPenny);
                });

                it('should gain 2A', function () {
                    expect(this.player1.amber).toBe(2);
                });
            });
        });

        describe('in low tide', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not gain skirmish', function () {
                expect(this.orphielSeaSChosen.getKeywordValue('skirmish')).toBe(0);
            });

            describe('and fights', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.orphielSeaSChosen, this.badPenny);
                });

                it('should not gain 2A', function () {
                    expect(this.player1.amber).toBe(0);
                });
            });
        });
    });
});
