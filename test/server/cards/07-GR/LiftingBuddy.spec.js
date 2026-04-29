describe('Lifting Buddy', function () {
    describe("Lifting Buddy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['lifting-buddy'],
                    inPlay: ['groke', 'cpo-zytar']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        describe('gives 2 power counters to self and another friendly creature', function () {
            beforeEach(function () {
                this.player1.playCreature(this.liftingBuddy);
                expect(this.player1).toBeAbleToSelect(this.cpoZytar);
                expect(this.player1).toBeAbleToSelect(this.groke);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                expect(this.player1).not.toBeAbleToSelect(this.liftingBuddy);
                this.player1.clickCard(this.groke);
            });

            it('on play', function () {
                expect(this.liftingBuddy.power).toBe(7);
                expect(this.groke.power).toBe(7);
                expect(this.player1).isReadyToTakeAction();
            });

            describe('on next turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();
                    this.player1.clickPrompt('brobnar');
                });

                it('on reap', function () {
                    this.player1.reap(this.liftingBuddy);
                    this.player1.clickCard(this.cpoZytar);
                    expect(this.liftingBuddy.power).toBe(9);
                    expect(this.cpoZytar.power).toBe(6);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('on fight', function () {
                    this.player1.fightWith(this.liftingBuddy, this.batdrone);
                    this.player1.clickCard(this.cpoZytar);
                    expect(this.liftingBuddy.power).toBe(9);
                    expect(this.cpoZytar.power).toBe(6);
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });
});
