describe('Ritual of Life', function () {
    describe("Ritual of Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['ritual-of-life'],
                    hand: ['ancient-bear', 'tantadlin'],
                    discard: ['dextre', 'archimedes', 'animator']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when there are no friendly creatures in play', function () {
            beforeEach(function () {
                this.player1.useAction(this.ritualOfLife);
            });

            it('should not do anything', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when there are friendly creatures in play', function () {
            beforeEach(function () {
                this.player1.play(this.ancientBear);
                this.player1.play(this.tantadlin);
                this.player1.useAction(this.ritualOfLife);
            });

            it('should be able to select friendly creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).not.toBeAbleToSelect(this.ritualOfLife);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            describe('and a creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.tantadlin);
                });

                it('the creature should be destroyed', function () {
                    expect(this.tantadlin.location).toBe('discard');
                });

                it('should be able to select a different creature from discard', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
                    expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
                    expect(this.player1).not.toBeAbleToSelect(this.animator);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                describe('and a creature from discard is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.archimedes);
                    });

                    it('the creature should be returned to hand', function () {
                        expect(this.archimedes.location).toBe('hand');
                    });
                });
            });
        });
    });
});
