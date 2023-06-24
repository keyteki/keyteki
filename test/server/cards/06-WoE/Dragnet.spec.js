describe('Dragnet', function () {
    describe("Dragnet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['rocketeer-tryska', 'lamindra'],
                    hand: ['dragnet']
                },
                player2: {
                    inPlay: ['bad-penny', 'troll', 'groggins']
                }
            });
        });

        it('should return a creature and each of its neighbors that shares a house with it to its owners hand', function () {
            this.player1.play(this.dragnet);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            this.player1.clickCard(this.troll);
            expect(this.lamindra.location).toBe('play area');
            expect(this.rocketeerTryska.location).toBe('play area');
            expect(this.badPenny.location).toBe('play area');
            expect(this.troll.location).toBe('hand');
            expect(this.groggins.location).toBe('hand');
        });
    });
});
