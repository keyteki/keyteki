describe('One Last Job', function () {
    describe("One Last Job's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['urchin', 'silvertooth', 'noddy-the-thief', 'troll'],
                    hand: ['one-last-job']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus']
                }
            });
        });

        it('should purge friendly shadow creatures and steal amber', function () {
            this.player1.play(this.oneLastJob);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.urchin.location).toBe('purged');
            expect(this.silvertooth.location).toBe('purged');
            expect(this.noddyTheThief.location).toBe('purged');
            expect(this.nexus.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
        });
    });
});
