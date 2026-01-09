describe('Hand of Dis', function () {
    describe("Hand of Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hand-of-dis']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('should destroy a creature that is not on a flank', function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hand of Dis's ability with only flank creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hand-of-dis']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not prompt when all creatures are on flanks', function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
