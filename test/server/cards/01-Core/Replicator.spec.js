describe('Replicator', function () {
    describe("Replicator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['replicator', 'gamgee', 'titan-mechanic'],
                    hand: ['virtuous-works']
                },
                player2: {
                    amber: 5,
                    inPlay: ['foozle', 'bingle-bangbang', 'quant'],
                    hand: ['anger']
                }
            });
        });

        it("should use Gamgee's reap effect", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.gamgee);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should use Foozle's reap effect", function () {
            this.player1.fightWith(this.titanMechanic, this.bingleBangbang);
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.foozle);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should fail Foozle's reap effect's condition", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.foozle);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should use Quant's reap ability", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.quant);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Replicator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 2,
                    hand: ['red-planet-ray-gun'],
                    inPlay: ['replicator', 'ulyq-megamouth', 'dextre', 'zorg', 'archimedes']
                },
                player2: {
                    amber: 5,
                    inPlay: ['foozle', 'bingle-bangbang']
                }
            });
        });

        it('copies reap effects including upgrades', function () {
            this.player1.playUpgrade(this.redPlanetRayGun, this.ulyqMegamouth);
            this.player1.reap(this.ulyqMegamouth);
            expect(this.player1).toHavePromptButton('Ulyq Megamouth');
            expect(this.player1).toHavePromptButton('Red Planet Ray Gun');
            this.player1.clickPrompt('Red Planet Ray Gun');
            this.player1.clickCard(this.foozle);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.replicator);
            this.player1.clickCard(this.replicator);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            this.player1.clickCard(this.ulyqMegamouth);
            expect(this.player1).toHavePrompt('Resolve ability from:');
            expect(this.player1).toHavePromptButton('Ulyq Megamouth');
            expect(this.player1).toHavePromptButton('Red Planet Ray Gun');
            this.player1.clickPrompt('Ulyq Megamouth');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Replicator's ability and opponent's use a friendly creature", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['replicator', 'dew-faerie', 'dextre']
                },
                player2: {
                    amber: 5,
                    inPlay: ['foozle', 'ulyq-megamouth']
                }
            });
        });

        it('use Ulyq Megamouth to use Dew Faerie', function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.ulyqMegamouth);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Replicator's ability and a creature with two reap abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['rhetor-gallim', 'replicator', 'kompsos-haruspex']
                },
                player2: {
                    amber: 5,
                    inPlay: ['rhetor-gallim']
                }
            });

            this.rhetorGhallim1 = this.player1.inPlay[0];
            this.rhetorGhallim2 = this.player2.inPlay[0];
        });

        it("should be able to choose friendly Rhetor Gallim's reap ability", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.rhetorGhallim1);
            expect(this.player1.currentPrompt().buttons[0].text).toBe('Rhetor Gallim');
            expect(this.player1.currentPrompt().buttons[1].text).toBe('Rhetor Gallim');
            this.player1.clickPrompt('Rhetor Gallim', 1); // Reap
            expect(this.rhetorGhallim1.tokens.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2).isReadyToTakeAction();
        });

        it("should be able to choose friendly Rhetor Gallim's play ability", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.rhetorGhallim1);
            expect(this.player1.currentPrompt().buttons[0].text).toBe('Rhetor Gallim');
            expect(this.player1.currentPrompt().buttons[1].text).toBe('Rhetor Gallim');
            this.player1.clickPrompt('Rhetor Gallim', 0); // Play
            expect(this.rhetorGhallim1.tokens.amber).toBe(undefined);
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2).isReadyToTakeAction();
        });

        it("should be able to choose opponent's Rhetor Gallim's reap ability", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.rhetorGhallim2);
            expect(this.rhetorGhallim2.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Replicator with Sanctum Guardian does not change control', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['replicator', 'dextre', 'gamgee']
                },
                player2: {
                    amber: 5,
                    inPlay: ['sanctum-guardian', 'sequis', 'bulwark']
                }
            });
        });

        it("should not be able to select opponent's creatures for swap when copying Sanctum Guardian", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.sanctumGuardian);
            // Should prompt for a creature to swap, but only own creatures should be selectable, and once selected should fizzle on changing control
            expect(this.player1).toHavePrompt('Sanctum Guardian');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.controller).toBe(this.player1.player);
            expect(this.sanctumGuardian.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Replicator with Sequis should capture from own side', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['replicator']
                },
                player2: {
                    amber: 2,
                    inPlay: ['sequis']
                }
            });
        });

        it("should capture from opponent's pool when copying opponent's Sequis", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.sequis);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.sequis.tokens.amber).toBe(1);
        });
    });
});
