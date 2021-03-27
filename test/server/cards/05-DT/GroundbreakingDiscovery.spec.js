describe('Groundbreaking Discovery', function () {
    describe("Groundbreaking Discovery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['lamindra', 'anomaly-exploiter'],
                    hand: [
                        'groundbreaking-discovery',
                        'doctor-verokter',
                        'roof-laboratory',
                        'reckless-experiment'
                    ]
                },
                player2: {
                    amber: 6,
                    inPlay: ['snufflegator', 'animator']
                }
            });

            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
        });

        it('when none of the three cards are in play, should do nothing', function () {
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Doctor Verokter is in play, should do nothing', function () {
            this.player1.play(this.doctorVerokter);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.doctorVerokter.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Roof Laborary is in play, should do nothing', function () {
            this.player1.play(this.roofLaboratory);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.roofLaboratory.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Reckless Experiment is in play, should do nothing', function () {
            this.player1.playUpgrade(this.recklessExperiment, this.lamindra);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Doctor Verokter and Roof Laboratory are in play, should do nothing', function () {
            this.player1.play(this.doctorVerokter);
            this.player1.play(this.roofLaboratory);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.doctorVerokter.location).toBe('play area');
            expect(this.roofLaboratory.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Doctor Verokter, Roof Laboratory are in play, and Reckless Experiment is on an enemy creature, should do nothing', function () {
            this.player1.play(this.doctorVerokter);
            this.player1.play(this.roofLaboratory);
            this.player1.playUpgrade(this.recklessExperiment, this.snufflegator);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.doctorVerokter.location).toBe('play area');
            expect(this.roofLaboratory.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Doctor Verokter, Roof Laboratory and Reckless Experiment are in play, KABUMMMM', function () {
            this.player1.play(this.doctorVerokter);
            this.player1.play(this.roofLaboratory);
            this.player1.playUpgrade(this.recklessExperiment, this.lamindra);
            this.player1.play(this.groundbreakingDiscovery);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(2);
            expect(this.doctorVerokter.location).toBe('discard');
            expect(this.roofLaboratory.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.anomalyExploiter.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.animator.location).toBe('discard');
            expect(this.recklessExperiment.location).toBe('discard');
            expect(this.groundbreakingDiscovery.location).toBe('purged');
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
        });
    });
});
