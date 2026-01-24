describe('Walk the Plank', function () {
    describe("Walk the Plank's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['sacro-thief'],
                    hand: ['walk-the-plank']
                },
                player2: {
                    amber: 5,
                    inPlay: ['collector-worm', 'eunoia', 'zorg']
                }
            });
        });

        describe('when opponent has amber', function () {
            beforeEach(function () {
                this.player1.play(this.walkThePlank);
            });

            it('should steal 1A', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(4);
                this.player1.endTurn();
            });
        });

        describe('when opponent has no amber', function () {
            beforeEach(function () {
                this.player2.player.amber = 0;
                this.player1.play(this.walkThePlank);
            });

            it('should prompt to deal damage to a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.collectorWorm);
                expect(this.player1).toBeAbleToSelect(this.eunoia);
                expect(this.player1).toBeAbleToSelect(this.sacroThief);
            });

            describe('and a creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eunoia);
                });

                it('should deal 4D and not steal', function () {
                    expect(this.eunoia.damage).toBe(4);
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(0);
                    this.player1.endTurn();
                });
            });
        });
    });
});
