describe('Mighty Lance', function () {
    describe("Mighty Lance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['mighty-lance']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt for creature when there are no creatures in play', function () {
            this.player1.play(this.mightyLance);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Mighty Lance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['titan-mechanic'],
                    hand: ['mighty-lance']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should deal 3D to a creature', function () {
            this.player1.play(this.mightyLance);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Mighty Lance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['titan-mechanic'],
                    hand: ['mighty-lance']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'troll', 'krump']
                }
            });
        });

        it('should deal 3D to a creature and 3D to its neighbor', function () {
            this.player1.play(this.mightyLance);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.titanMechanic);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
