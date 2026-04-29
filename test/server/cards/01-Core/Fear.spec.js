describe('Fear', function () {
    describe("Fear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['fear'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("should return an enemy creature to its owner's hand", function () {
            this.player1.play(this.fear);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Fear's ability with no enemy creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['fear'],
                    inPlay: ['ember-imp']
                },
                player2: {}
            });
        });

        it('should not prompt when there are no enemy creatures', function () {
            this.player1.play(this.fear);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
