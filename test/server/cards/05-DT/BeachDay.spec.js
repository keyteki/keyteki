describe('Beach Day', function () {
    describe("Beach Day's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'snufflegator', 'bumblebird'],
                    hand: ['beach-day']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'faygin']
                }
            });
        });

        describe('when the tide is not high', function () {
            describe('when played', function () {
                beforeEach(function () {
                    this.player1.play(this.beachDay);
                });

                it('should prompt to select a friendly creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.ancientBear);
                    expect(this.player1).toBeAbleToSelect(this.bumblebird);
                    expect(this.player1).toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).toBeAbleToSelect(this.murkens);
                    expect(this.player1).toBeAbleToSelect(this.faygin);
                });

                describe('and a creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.bumblebird);
                    });

                    it('should return to hand', function () {
                        expect(this.bumblebird.location).toBe('hand');
                        expect(this.bumblebird.controller).toBe(this.player1.player);
                    });

                    it('should not gain 1A', function () {
                        expect(this.player1.amber).toBe(2);
                        expect(this.player2.amber).toBe(4);
                    });
                });
            });
        });

        describe('when the tide is high', function () {
            describe('when played', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.play(this.beachDay);
                });

                it('should prompt to select a friendly creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.ancientBear);
                    expect(this.player1).toBeAbleToSelect(this.bumblebird);
                    expect(this.player1).toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).toBeAbleToSelect(this.murkens);
                    expect(this.player1).toBeAbleToSelect(this.faygin);
                });

                describe('and a creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.bumblebird);
                    });

                    it('should return to hand', function () {
                        expect(this.bumblebird.location).toBe('hand');
                        expect(this.bumblebird.controller).toBe(this.player1.player);
                    });

                    it('should gain 1A', function () {
                        expect(this.player1.chains).toBe(3);
                        expect(this.player1.amber).toBe(3);
                        expect(this.player2.amber).toBe(4);
                    });
                });
            });
        });
    });
});
