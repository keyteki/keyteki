describe('Shield-U-Later Evil Twin', function () {
    describe("Shield-U-Later Evil Twin's ability", function () {
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
                    hand: ['shield-u-later-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('can be played as a creature', function () {
            this.player1.play(this.shieldULaterEvilTwin);
            expect(this.shieldULaterEvilTwin.location).toBe('play area');
        });

        it('can be played as an upgrade', function () {
            this.player1.playUpgrade(this.shieldULaterEvilTwin, this.operationsOfficerYshi);
            expect(this.operationsOfficerYshi.power).toBe(2);
            expect(this.operationsOfficerYshi.armor).toBe(0);
        });
    });
});
