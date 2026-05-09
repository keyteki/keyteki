describe('Killzord Mk. 9001', function () {
    describe("Killzord Mk. 9001's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['killzord-mk-9001'],
                    inPlay: ['mindwarper']
                },
                player2: {
                    inPlay: ['tunk']
                }
            });
        });

        it('should give +2 power, +2 armor, skirmish, and Fight: Gain 1 chain', function () {
            this.player1.playUpgrade(this.killzordMk9001, this.mindwarper);
            expect(this.mindwarper.power).toBe(4);
            expect(this.mindwarper.armor).toBe(2);
            expect(this.mindwarper.getKeywordValue('skirmish')).toBe(1);
            this.player1.fightWith(this.mindwarper, this.tunk);
            expect(this.mindwarper.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
