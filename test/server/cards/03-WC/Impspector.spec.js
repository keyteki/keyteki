describe('Impspector', function () {
    describe("Impspector's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['impspector']
                },
                player2: {
                    hand: ['mind-barb'],
                    inPlay: ['mother']
                }
            });
        });

        it('should cause opponent to purge a random card from their hand when it is destroyed', function () {
            this.player1.fightWith(this.impspector, this.mother);
            expect(this.mindBarb.location).toBe('purged');
        });

        it('should work when opponent has an empty hand', function () {
            this.player2.player.hand = [];
            this.player1.fightWith(this.impspector, this.mother);
            expect(this.player2.player.purged.length).toBe(0);
        });
    });
});
