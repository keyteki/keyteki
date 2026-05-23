describe('Away Team', function () {
    describe("Away Team's destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['away-team'],
                    hand: ['z-ray-blaster']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('archives upgrades on Away Team when destroyed', function () {
            this.player1.playUpgrade(this.zRayBlaster, this.awayTeam);
            expect(this.awayTeam.upgrades).toContain(this.zRayBlaster);
            this.player1.fightWith(this.awayTeam, this.troll);
            expect(this.awayTeam.location).toBe('discard');
            expect(this.zRayBlaster.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
