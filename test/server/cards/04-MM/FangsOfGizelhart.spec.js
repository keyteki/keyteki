describe('fangs-of-gizelhart', function () {
    describe("Access Denied's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny'],
                    hand: ['fangs-of-gizelhart']
                },
                player2: {
                    amber: 1,
                    inPlay: ['truebaru']
                }
            });
        });

        it('should purge truebaru', function () {
            this.player1.play(this.fangsOfGizelhart);
            expect(this.player1).toBeAbleToSelect(this.truebaru);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.truebaru);
            expect(this.truebaru.location).toBe('purged');
            expect(this.badPenny.location).toBe('play area');
        });
    });
});
