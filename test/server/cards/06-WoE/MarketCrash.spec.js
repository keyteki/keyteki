describe('Market Crash', function () {
    describe("Market Crash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['pelf', 'grunt:mass-buyout'],
                    hand: ['market-crash']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['warrior:batdrone', 'bumpsy']
                }
            });
        });

        it('destroys all non-token creatures', function () {
            this.player1.play(this.marketCrash);
            expect(this.pelf.location).toBe('discard');
            expect(this.grunt.location).toBe('play area');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.warrior.location).toBe('play area');
            expect(this.player1.chains).toBe(2);
        });
    });
});
