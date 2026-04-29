describe('Groundbreaking Discovery', function () {
    describe("Groundbreaking Discovery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['lamindra', 'anomaly-exploiter'],
                    hand: [
                        'groundbreaking-discovery',
                        'dr-verokter',
                        'rooftop-laboratory',
                        'reckless-experimentation'
                    ]
                },
                player2: {
                    amber: 6,
                    inPlay: ['snufflegator', 'animator'],
                    hand: ['encounter-suit']
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

        it('when just Dr. Verokter is in play, should do nothing', function () {
            this.player1.play(this.drVerokter);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.drVerokter.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Rooftop Laborary is in play, should do nothing', function () {
            this.player1.play(this.rooftopLaboratory);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.rooftopLaboratory.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Reckless Experimentationation is in play, should do nothing', function () {
            this.player1.playUpgrade(this.recklessExperimentation, this.lamindra);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        it('when just Dr. Verokter and Rooftop Laboratory are in play, should do nothing', function () {
            this.player1.play(this.drVerokter);
            this.player1.play(this.rooftopLaboratory);
            this.player1.play(this.groundbreakingDiscovery);
            this.player1.endTurn();
            expect(this.drVerokter.location).toBe('play area');
            expect(this.rooftopLaboratory.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.animator.location).toBe('play area');
            expect(this.groundbreakingDiscovery.location).toBe('discard');
        });

        // Issue #3415: Upgrades played on enemy creatures are controlled by the player who played them
        it('when Dr. Verokter, Rooftop Laboratory are in play, and Reckless Experimentation is on an enemy creature, KABUMMMM', function () {
            this.player1.play(this.drVerokter);
            this.player1.play(this.rooftopLaboratory);
            this.player1.playUpgrade(this.recklessExperimentation, this.snufflegator);
            this.player1.play(this.groundbreakingDiscovery);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.drVerokter.location).toBe('discard');
            expect(this.rooftopLaboratory.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.anomalyExploiter.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.animator.location).toBe('discard');
            expect(this.recklessExperimentation.location).toBe('discard');
            expect(this.groundbreakingDiscovery.location).toBe('purged');
        });

        it('when just Dr. Verokter, Rooftop Laboratory and Reckless Experimentation are in play, KABUMMMM', function () {
            this.player1.play(this.drVerokter);
            this.player1.play(this.rooftopLaboratory);
            this.player1.playUpgrade(this.recklessExperimentation, this.lamindra);
            this.player1.play(this.groundbreakingDiscovery);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(2);
            expect(this.drVerokter.location).toBe('discard');
            expect(this.rooftopLaboratory.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.anomalyExploiter.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.animator.location).toBe('discard');
            expect(this.recklessExperimentation.location).toBe('discard');
            expect(this.groundbreakingDiscovery.location).toBe('purged');
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
        });

        it('when Dr. Verokter, Rooftop Lab, Reckless Experimentation and a warded creature with upgrades are in play, should destroy upgrades, ', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.encounterSuit, this.snufflegator);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.drVerokter);
            this.player1.play(this.rooftopLaboratory);
            this.player1.playUpgrade(this.recklessExperimentation, this.lamindra);
            this.player1.play(this.groundbreakingDiscovery);
            expect(this.snufflegator.location).toBe('play area');
            expect(this.encounterSuit.location).toBe('discard');
        });
    });
});
