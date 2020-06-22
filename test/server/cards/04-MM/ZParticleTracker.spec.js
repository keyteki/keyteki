describe('Z-Particle Tracker', function () {
    describe("Z-Particle Tracker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['captain-val-jericho'],
                    hand: [
                        'z-ray-blaster',
                        'z-particle-tracker',
                        'light-of-the-archons',
                        'explo-rover'
                    ],
                    amber: 3
                },
                player2: {
                    inPlay: ['valdr', 'troll', 'nexus']
                }
            });

            this.player1.player.moveCard(this.zRayBlaster, 'deck');
            this.player1.player.moveCard(this.lightOfTheArchons, 'deck');
            this.player1.player.moveCard(this.exploRover, 'deck');
        });

        it('should search for an upgrade and move to hand', function () {
            this.player1.playUpgrade(this.zParticleTracker, this.captainValJericho);
            this.player1.fightWith(this.captainValJericho, this.nexus);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.zRayBlaster);
            expect(this.player1).toBeAbleToSelect(this.lightOfTheArchons);
            expect(this.player1).not.toBeAbleToSelect(this.exploRover);
            this.player1.clickCard(this.lightOfTheArchons);
            this.player1.clickPrompt('Done');

            expect(this.lightOfTheArchons.location).toBe('hand');
        });
    });
});
