describe("Norbyn's Cavern", function () {
    describe("Norbyn's Cavern's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'staralliance',
                    token: 'æmberling',
                    inPlay: ['æmberling:pelf', 'norbyn-s-cavern']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bumpsy']
                }
            });
        });

        it('gives power and skirmish', function () {
            expect(this.æmberling.power).toBe(4);
            this.player1.fightWith(this.æmberling, this.bumpsy);
            expect(this.æmberling.location).toBe('play area');
            expect(this.bumpsy.tokens.damage).toBe(4);
            expect(this.æmberling.tokens.damage).toBe(undefined);
        });
    });
});
