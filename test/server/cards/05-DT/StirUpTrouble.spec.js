describe('Stir Up Trouble', function () {
    describe("Stir Up Trouble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['sacro-thief'],
                    hand: ['dodger', 'stir-up-trouble']
                },
                player2: {
                    amber: 5,
                    inPlay: ['collector-worm', 'eunoia', 'zorg']
                }
            });
        });

        describe('when played and no creatures in play', function () {
            beforeEach(function () {
                this.player1.moveCard(this.sacroThief, 'hand');
                this.player2.moveCard(this.collectorWorm, 'hand');
                this.player2.moveCard(this.eunoia, 'hand');
                this.player2.moveCard(this.zorg, 'hand');
                this.player1.play(this.stirUpTrouble);
            });

            it('should not prompt', function () {
                this.player1.endTurn();
            });
        });

        describe('when played and select a creature without neighbor', function () {
            beforeEach(function () {
                this.player1.play(this.stirUpTrouble);
                this.player1.clickCard(this.sacroThief);
            });

            it('should not cause damage', function () {
                expect(this.sacroThief.tokens.damage).toBeUndefined();
                this.player1.endTurn();
            });
        });

        describe('when played and select a creature with a single neighbor', function () {
            beforeEach(function () {
                this.player1.play(this.dodger);
                this.player1.play(this.stirUpTrouble);
                this.player1.clickCard(this.sacroThief);
            });

            it('should prompt to select a neighbor', function () {
                expect(this.player1).not.toBeAbleToSelect(this.zorg);
                expect(this.player1).not.toBeAbleToSelect(this.collectorWorm);
                expect(this.player1).not.toBeAbleToSelect(this.eunoia);
                expect(this.player1).not.toBeAbleToSelect(this.sacroThief);
                expect(this.player1).toBeAbleToSelect(this.dodger);
            });

            it('should prompt for neighbor and cause damage', function () {
                this.player1.clickCard(this.dodger);
                expect(this.sacroThief.tokens.damage).toBe(3);
                expect(this.dodger.tokens.damage).toBe(4);
                this.player1.endTurn();
            });
        });

        describe('when played and select a creature with two neighbors', function () {
            beforeEach(function () {
                this.player1.play(this.stirUpTrouble);
                this.player1.clickCard(this.eunoia);
            });

            it('should prompt to select a neighbor', function () {
                expect(this.player1).not.toBeAbleToSelect(this.sacroThief);
                expect(this.player1).not.toBeAbleToSelect(this.eunoia);
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            });

            describe('and a neighbor is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.collectorWorm);
                });

                it('should cause damage to each other', function () {
                    expect(this.collectorWorm.tokens.damage).toBe(1);
                    expect(this.eunoia.tokens.damage).toBe(2);
                });
            });
        });
    });
});
