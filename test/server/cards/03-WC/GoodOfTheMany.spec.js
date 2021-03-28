describe('Good of the Many', function () {
    describe("Good of the Many's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'mindwarper',
                        'blypyp',
                        'philophosaurus',
                        'orator-hissaro',
                        'terrordactyl'
                    ],
                    hand: ['good-of-the-many']
                },
                player2: {
                    inPlay: ['lamindra', 'gamgee', 'bad-penny', 'plague-rat']
                }
            });
        });

        it('should destroy all creatures that do not share a trait with another creature in its battleline', function () {
            this.player1.play(this.goodOfTheMany);

            expect(this.mindwarper.location).toBe('play area');
            expect(this.blypyp.location).toBe('play area');
            expect(this.philophosaurus.location).toBe('play area');
            expect(this.oratorHissaro.location).toBe('play area');
            expect(this.terrordactyl.location).toBe('discard');

            expect(this.lamindra.location).toBe('play area');
            expect(this.gamgee.location).toBe('play area');
            expect(this.badPenny.location).toBe('play area');
            expect(this.plagueRat.location).toBe('discard');
        });
    });
});
