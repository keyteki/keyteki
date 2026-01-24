describe('Titanic Bumblebird', function () {
    describe("Titanic Bumblebird's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['titanic-bumblebird', 'titanic-bumblebird2'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'umbra']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.titanicBumblebird2, 'discard');
            this.player1.clickCard(this.titanicBumblebird);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.titanicBumblebird, 'discard');
            this.player1.clickCard(this.titanicBumblebird2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.titanicBumblebird);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.titanicBumblebird2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to destroy an enemy creature and give power counters to a friendly creature on play', function () {
            this.player1.playCreature(this.titanicBumblebird);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.titanicBumblebird);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.titanicBumblebird);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.getPower()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy an enemy creature and give power counters to a friendly creature on reap', function () {
            this.player1.playCreature(this.titanicBumblebird);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.flaxia);
            this.titanicBumblebird.ready();
            this.player1.reap(this.titanicBumblebird);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.titanicBumblebird);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.titanicBumblebird);
            this.player1.clickCard(this.titanicBumblebird);
            expect(this.titanicBumblebird.getPower()).toBe(9);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
