describe('The Circle of Life', function () {
    describe("The Circle of Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['the-circle-of-life'],
                    inPlay: ['dust-pixie', 'roxador'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    inPlay: ['gloriana-s-attendant', 'troll'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('does not gain amber if no one is haunted', function () {
            this.player1.play(this.theCircleOfLife);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });

        it('gains amber for the haunted player', function () {
            this.player1.fightWith(this.dustPixie, this.troll);
            this.player1.play(this.theCircleOfLife);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
        });

        it('gains amber for the haunted opponent', function () {
            this.player1.fightWith(this.roxador, this.glorianaSAttendant);
            this.player1.play(this.theCircleOfLife);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('gains amber for both haunted players', function () {
            this.player1.fightWith(this.dustPixie, this.glorianaSAttendant);
            this.player1.play(this.theCircleOfLife);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });
    });
});
