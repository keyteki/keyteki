describe('Tachyon Pulse', function () {
    describe("Tachyon Pulse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['nexus', 'techivore-pulpate', 'uncharted-lands'],
                    hand: ['tachyon-pulse', 'force-field', 'disruption-field', 'explo-rover']
                },
                player2: {
                    inPlay: ['the-sting', 'lifeward', 'urchin', 'lamindra']
                }
            });
        });

        it('should destroy all artifacts and exhaust creatures with upgrade', function () {
            this.player1.playUpgrade(this.forceField, this.nexus);
            this.player1.playUpgrade(this.exploRover, this.nexus);
            this.player1.playUpgrade(this.disruptionField, this.lamindra);
            this.player1.play(this.tachyonPulse);
            expect(this.lifeward.location).toBe('discard');
            expect(this.theSting.location).toBe('discard');
            expect(this.unchartedLands.location).toBe('discard');

            expect(this.nexus.location).toBe('play area');
            expect(this.techivorePulpate.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');

            expect(this.nexus.exhausted).toBe(true);
            expect(this.techivorePulpate.exhausted).toBe(false);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(false);
        });

        it('should exhaust creatures with upgrade even if there are no artifacts', function () {
            this.player1.moveCard(this.unchartedLands, 'discard');
            this.player1.moveCard(this.lifeward, 'discard');
            this.player1.moveCard(this.unchartedLands, 'discard');

            this.player1.playUpgrade(this.forceField, this.nexus);
            this.player1.playUpgrade(this.exploRover, this.nexus);
            this.player1.playUpgrade(this.disruptionField, this.lamindra);
            this.player1.play(this.tachyonPulse);

            expect(this.nexus.location).toBe('play area');
            expect(this.techivorePulpate.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');

            expect(this.nexus.exhausted).toBe(true);
            expect(this.techivorePulpate.exhausted).toBe(false);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(false);
        });
    });
});
