describe('Gatewatcher', function () {
    describe("Gatewatcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['draining-touch'],
                    inPlay: ['hunting-witch', 'dust-imp', 'charette', 'batdrone'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['gatewatcher', 'bubbles']
                }
            });
        });

        it('does nothing on destroy when opponent not haunted', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.gatewatcher);
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.dustImp.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.batdrone.location).toBe('play area');
            expect(this.gatewatcher.location).toBe('discard');
            expect(this.bubbles.location).toBe('play area');
        });

        it('destroys enemy flank creatures on destroy when opponent not haunted', function () {
            this.player1.fightWith(this.dustImp, this.gatewatcher);
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.gatewatcher);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dustImp.location).toBe('discard');
            expect(this.charette.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.gatewatcher.location).toBe('discard');
            expect(this.bubbles.location).toBe('play area');
        });
    });
});
