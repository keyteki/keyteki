describe('sinder', function () {
    describe("Sinder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['dust-imp'],
                    inPlay: ['sinder']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should destroy itself if only friendly creature in play', function () {
            this.player1.reap(this.sinder);
            expect(this.player1).toHavePrompt('Sinder');
            expect(this.player1).toBeAbleToSelect(this.sinder);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.sinder);
            expect(this.sinder.location).toBe('discard');
        });

        it('should be able to select which friendly creature to destroy', function () {
            this.player1.play(this.dustImp);
            this.player1.reap(this.sinder);
            expect(this.player1).toHavePrompt('Sinder');
            expect(this.player1).toBeAbleToSelect(this.sinder);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.dustImp);
            expect(this.sinder.location).toBe('play area');
            expect(this.dustImp.location).toBe('discard');
        });
    });
});
