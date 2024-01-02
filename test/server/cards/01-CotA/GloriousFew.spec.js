describe('Glorious Few', function () {
    describe("Glorious Few's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'sanctum',
                    hand: ['glorious-few'],
                    inPlay: ['sequis'],
                    discard: ['batdrone', 'zorg', 'mindwarper']
                },
                player2: {
                    inPlay: ['doc-bookton', 'dextre', 'troll']
                }
            });
        });

        it('should give the player amber equal to the difference between the number of creatures on each side', function () {
            this.player1.play(this.gloriousFew);
            expect(this.player1.amber).toBe(5);
        });

        it('should not do anything when the player has more creatures', function () {
            this.player1.moveCard(this.batdrone, 'play area');
            this.player1.moveCard(this.zorg, 'play area');
            this.player1.moveCard(this.mindwarper, 'play area');
            this.player1.play(this.gloriousFew);
            expect(this.player1.amber).toBe(3);
        });
    });
});
