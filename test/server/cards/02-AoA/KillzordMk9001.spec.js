describe('Killzord Mk. 9001', function () {
    describe("Killzord Mk. 9001's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['killzord-mk-9001'],
                    inPlay: ['batdrone']
                },
                player2: {
                    inPlay: ['tunk']
                }
            });
        });

        it('should give +2 power, +2 armor, skirmish, and Fight: Gain 1 chain', function () {
            this.player1.playUpgrade(this.killzordMk9001, this.batdrone);

            expect(this.batdrone.power).toBe(3);
            expect(this.batdrone.armor).toBe(2);
            expect(this.batdrone.getKeywordValue('skirmish')).toBe(1);

            this.player1.fightWith(this.batdrone, this.tunk);

            expect(this.batdrone.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
