describe('ThinkTwice', function () {
    describe("ThinkTwice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['think-twice'],
                    discard: ['poke', 'eyegor', 'way-of-the-wolf', 'animator']
                }
            });
        });

        describe('when its played', function () {
            beforeEach(function () {
                this.player1.play(this.thinkTwice);
            });

            it('should be able to select actions and not creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.poke);
                expect(this.player1).not.toBeAbleToSelect(this.eyegor);
                expect(this.player1).not.toBeAbleToSelect(this.wayOfTheWolf);
                expect(this.player1).not.toBeAbleToSelect(this.animator);
            });

            describe('select action', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.poke);
                });

                it('play then purge the action', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this.poke.location).toBe('purged');
                });
            });
        });
    });
});
