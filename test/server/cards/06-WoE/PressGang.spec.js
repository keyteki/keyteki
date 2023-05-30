describe('Press Gang', function () {
    describe("Press Gang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grumpus',
                    inPlay: ['bumpsy'],
                    hand: ['press-gang']
                },
                player2: {
                    inPlay: ['batdrone', 'troll']
                }
            });
        });

        it('should not archive if no enemy creatures have been destroyed', function () {
            this.player1.play(this.pressGang);
            this.player1.clickPrompt('Right');
            expect(this.pressGang.location).toBe('discard');
        });

        it('should archive if there was an enemy creature destroyed', function () {
            this.player1.fightWith(this.bumpsy, this.batdrone);
            this.player1.play(this.pressGang);
            this.player1.clickPrompt('Right');
            expect(this.pressGang.location).toBe('archives');
        });
    });
});
