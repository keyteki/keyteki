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

        it('should cause opponent to purge a random card from their hand when it is destroyeda', function () {
            this.player1.fightWith(this.impspector, this.mother);
            expect(this.mindBarb.location).toBe('purged');
        });
    });
});
