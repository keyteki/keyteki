describe('Growth Surge', function () {
    integration(function () {
        describe("Growth Surge's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        hand: ['growth-surge']
                    },
                    player2: {
                        amber: 1
                    }
                });
            });

            it('should not prompt for creature when there are no creatures in play', function () {
                this.player1.play(this.growthSurge);
                expect(this.player1.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe("Growth Surge's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['titan-mechanic'],
                        hand: ['growth-surge']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['troll']
                    }
                });
            });

            it('should add 3 power counters to a creature', function () {
                this.player1.play(this.growthSurge);
                expect(this.player1.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a creature');
                expect(this.player1).toBeAbleToSelect(this.titanMechanic);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);
                expect(this.troll.tokens.power).toBe(3);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe("Growth Surge's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['titan-mechanic'],
                        hand: ['growth-surge']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['troll', 'krump']
                    }
                });
            });

            it('should add 3 power counters to a creature and 2 to its neighbor', function () {
                this.player1.play(this.growthSurge);
                expect(this.player1.amber).toBe(1);
                expect(this.player1).toHavePrompt('Choose a creature');
                expect(this.player1).toBeAbleToSelect(this.titanMechanic);
                expect(this.player1).toBeAbleToSelect(this.krump);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);
                expect(this.troll.tokens.power).toBe(3);
                expect(this.krump.tokens.power).toBe(2);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
