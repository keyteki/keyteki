describe('Growth Surge', function () {
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

    describe("Growth Surge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['titan-mechanic', 'spectral-tunneler'],
                    hand: ['phase-shift', 'growth-surge']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'groggins', 'krump', 'redlock', 'lamindra']
                }
            });
        });

        it('should add 3 power counters to a creature, 2 to its neighbor and 1 to the either neighbor', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.growthSurge);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.power).toBe(3);
            expect(this.groggins.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBe(1);
            expect(this.redlock.tokens.power).toBeUndefined();
            expect(this.lamindra.tokens.power).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to select the Spectral Tunneler's target and a neighbor with no other neighbor", function () {
            this.player1.useAction(this.spectralTunneler);
            this.player1.clickCard(this.groggins);
            this.player1.play(this.phaseShift);
            this.player1.play(this.growthSurge);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.groggins);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.groggins.tokens.power).toBe(3);
            expect(this.troll.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBeUndefined();
            expect(this.redlock.tokens.power).toBeUndefined();
            expect(this.lamindra.tokens.power).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to select the Spectral Tunneler's target and a neighbor with another neighbor ", function () {
            this.player1.useAction(this.spectralTunneler);
            this.player1.clickCard(this.groggins);
            this.player1.play(this.phaseShift);
            this.player1.play(this.growthSurge);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.groggins);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.krump);
            expect(this.groggins.tokens.power).toBe(3);
            expect(this.krump.tokens.power).toBe(2);
            expect(this.redlock.tokens.power).toBe(1);
            expect(this.troll.tokens.power).toBeUndefined();
            expect(this.lamindra.tokens.power).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
