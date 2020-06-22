describe('The Fittest', function () {
    describe("The Fittest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dust-pixie', 'rustgnawer', 'snufflegator', 'duskwitch'],
                    hand: ['the-fittest', 'dew-faerie']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });
        it('should give all friendly creatures a +1 power counter', function () {
            this.player1.play(this.theFittest);
            expect(this.dustPixie.tokens.power).toBe(1);
            expect(this.rustgnawer.tokens.power).toBe(1);
            expect(this.snufflegator.tokens.power).toBe(1);
            expect(this.duskwitch.tokens.power).toBe(1);
            expect(this.mightyTiger.tokens.power).toBe(undefined);
            expect(this.grabberJammer.tokens.power).toBe(undefined);
        });
    });
});
