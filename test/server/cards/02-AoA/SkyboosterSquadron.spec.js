describe('Skybooster Squadron', function () {
    describe("Skybooster Squadron's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['skybooster-squadron', 'mindworm']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('returns only Skybooster Squadron to its owner hand on reap and leaves other creatures in play', function () {
            this.player1.reap(this.skyboosterSquadron);
            expect(this.player1.amber).toBe(1);
            expect(this.skyboosterSquadron.location).toBe('hand');
            expect(this.mindworm.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('is blocked by ward when reaping, removing the ward instead of returning to hand', function () {
            this.skyboosterSquadron.ward();
            this.player1.reap(this.skyboosterSquadron);
            expect(this.player1.amber).toBe(1);
            expect(this.skyboosterSquadron.location).toBe('play area');
            expect(this.skyboosterSquadron.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
