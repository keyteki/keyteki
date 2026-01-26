describe('Assert Dominance', function () {
    describe("Assert Dominance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'snufflegator', 'bumblebird'],
                    hand: ['assert-dominance']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'faygin']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.assertDominance);
            });

            it('should prompt to select a friendly creature', function () {
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.bumblebird);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
                expect(this.player1).not.toBeAbleToSelect(this.faygin);
            });

            describe('and a creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.bumblebird);
                });

                it('should give it skirmish', function () {
                    expect(this.bumblebird.getKeywordValue('skirmish')).toBe(1);
                });

                it('should prompt to select an enemy creature', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
                    expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
                    expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).toBeAbleToSelect(this.murkens);
                    expect(this.player1).toBeAbleToSelect(this.faygin);
                });

                describe('and an enemy is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.murkens);
                    });

                    it('should fight with it', function () {
                        expect(this.bumblebird.exhausted).toBe(true);
                        expect(this.bumblebird.damage).toBe(0);
                        expect(this.murkens.damage).toBe(1);
                    });
                });
            });
        });
    });
});
