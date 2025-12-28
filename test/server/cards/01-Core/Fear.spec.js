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
                    amber: 1,
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt when there are no enemy creatures', function () {
            this.player1.play(this.fear);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
