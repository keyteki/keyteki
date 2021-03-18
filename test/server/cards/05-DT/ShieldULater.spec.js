describe('Shield-U-Later', function () {
    describe("Shield-U-Later's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: [
                        'armsmaster-molina',
                        'bulwark',
                        'operations-officer-yshi',
                        'scout-pete'
                    ],
                    hand: ['shield-u-later']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('can be played as a creature', function () {
            this.player1.play(this.shieldULater);
            expect(this.shieldULater.location).toBe('play area');
        });

        it('can be played as an upgrade', function () {
            this.player1.playUpgrade(this.shieldULater, this.scoutPete);
            expect(this.scoutPete.armor).toBe(2);
        });
    });
});
