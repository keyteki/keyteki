describe('Light of the Archons', function () {
    describe("Light of the Archons's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['light-of-the-archons', 'explo-rover', 'force-field'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should get +1 power/amor per upgrade attached', function () {
            expect(this.techivorePulpate.power).toBe(5);
            expect(this.techivorePulpate.hasToken('armor')).toBe(false);
            this.player1.playUpgrade(this.lightOfTheArchons, this.techivorePulpate);
            expect(this.techivorePulpate.power).toBe(6);
            expect(this.techivorePulpate.tokens.armor).toBe(1);
            this.player1.playUpgrade(this.forceField, this.techivorePulpate);
            expect(this.techivorePulpate.power).toBe(7);
            expect(this.techivorePulpate.tokens.armor).toBe(2);
            this.player1.playUpgrade(this.exploRover, this.techivorePulpate);
            expect(this.techivorePulpate.power).toBe(8);
            expect(this.techivorePulpate.tokens.armor).toBe(3);
        });
    });
});
