describe('Z-Ray Blaster', function () {
    describe("Z-Ray Blaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['captain-val-jericho'],
                    hand: ['z-ray-blaster', 'light-of-the-archons'],
                    amber: 3
                },
                player2: {
                    inPlay: ['valdr', 'troll', 'nexus']
                }
            });
        });

        it('fyre breath upgrades creature with +3 power and before fight effect dealing 3 damage to neighbors', function () {
            this.player1.playUpgrade(this.zRayBlaster, this.captainValJericho);
            expect(this.captainValJericho.power).toBe(8);
            this.player1.fightWith(this.captainValJericho, this.troll);

            expect(this.troll.location).toBe('discard');
            expect(this.captainValJericho.location).toBe('play area');
            expect(this.captainValJericho.tokens.damage).toBe(7);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.nexus.location).toBe('discard');
        });
    });
});
