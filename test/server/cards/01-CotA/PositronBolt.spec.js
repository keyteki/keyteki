describe('Positron Bolt', function () {
    describe("Positron Bolt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['positron-bolt']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt for creature when there are no creatures in play', function () {
            this.player1.play(this.positronBolt);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Positron Bolt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['titan-mechanic'],
                    hand: ['positron-bolt']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should deal 3D to a creature', function () {
            this.player1.play(this.positronBolt);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Positron Bolt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['titan-mechanic'],
                    hand: ['positron-bolt']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal 3D to a creature and 2D to its neighbor', function () {
            this.player1.play(this.positronBolt);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Positron Bolt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['titan-mechanic', 'spectral-tunneler'],
                    hand: ['positron-bolt']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'groggins', 'krump', 'redlock', 'lamindra']
                }
            });
        });

        it('should deal 3D to a creature, 2D to its neighbor and 1D to the either neighbor', function () {
            this.player1.play(this.positronBolt);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.groggins.tokens.damage).toBe(2);
            expect(this.krump.tokens.damage).toBe(1);
            expect(this.redlock.tokens.damage).toBeUndefined();
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to select the Spectral Tunneler's target and a neighbor with no other neighbor", function () {
            this.player1.useAction(this.spectralTunneler);
            this.player1.clickCard(this.groggins);
            this.player1.play(this.positronBolt);
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
            expect(this.groggins.tokens.damage).toBe(3);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.redlock.tokens.damage).toBeUndefined();
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to select the Spectral Tunneler's target and a neighbor with another neighbor ", function () {
            this.player1.useAction(this.spectralTunneler);
            this.player1.clickCard(this.groggins);
            this.player1.play(this.positronBolt);
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
            expect(this.groggins.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.redlock.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.lamindra.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
