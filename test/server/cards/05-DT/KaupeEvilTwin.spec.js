describe('Kaupe Evil Twin', function () {
    describe("Kaupe Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'kaupe-evil-twin'],
                    hand: [
                        'commander-chan',
                        'doctor-driscoll',
                        'explo-rover',
                        'uncharted-lands',
                        'transporter-platform',
                        'access-denied',
                        'detention-coil',
                        'stealth-mode',
                        'galactic-census'
                    ]
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['animator', 'anomaly-exploiter', 'dextre', 'archimedes']
                }
            });
        });

        it('should be able to play 1 card of each only while kaupe is in play', function () {
            this.player1.play(this.stealthMode);
            expect(this.stealthMode.location).toBe('discard');
            this.player1.play(this.doctorDriscoll);
            expect(this.doctorDriscoll.location).toBe('play area');
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.location).toBe('play area');
            this.player1.playUpgrade(this.accessDenied, this.troll);
            expect(this.accessDenied.parent).toBe(this.troll);

            this.player1.clickCard(this.commanderChan);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.exploRover);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.detentionCoil);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.transporterPlatform);
            expect(this.player1).not.toHavePromptButton('Play this artifact');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.galacticCensus);
            expect(this.player1).not.toHavePromptButton('Play this action');
            this.player1.clickPrompt('Discard this card');
        });

        it('should be able to play explo-rover as upgrade', function () {
            this.player1.playUpgrade(this.exploRover, this.kaupeEvilTwin);
            expect(this.exploRover.parent).toBe(this.kaupeEvilTwin);

            this.player1.clickCard(this.accessDenied);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.detentionCoil);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');
        });

        it('should be able to play mores cards once Kaupe is not in play', function () {
            this.player1.moveCard(this.kaupeEvilTwin, 'discard');
            this.player1.play(this.stealthMode);
            this.player1.play(this.doctorDriscoll);
            this.player1.play(this.unchartedLands);
            this.player1.playUpgrade(this.accessDenied, this.armsmasterMolina);
            this.player1.play(this.commanderChan);
            this.player1.playUpgrade(this.exploRover, this.armsmasterMolina);
            this.player1.play(this.transporterPlatform);
            this.player1.play(this.galacticCensus);
        });

        it('should not affect opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.animator);
            this.player2.play(this.archimedes);
            this.player2.play(this.dextre);
            this.player2.play(this.anomalyExploiter);
        });
    });

    describe("Kaupe Evil Twin's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['armsmaster-molina', 'kaupe-evil-twin'],
                    hand: [
                        'commander-chan',
                        'doctor-driscoll',
                        'explo-rover',
                        'uncharted-lands',
                        'transporter-platform',
                        'access-denied',
                        'detention-coil',
                        'stealth-mode',
                        'galactic-census'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'gladiodontus']
                }
            });
        });

        it('should be able to discard no cards from hand', function () {
            this.player1.reap(this.kaupeEvilTwin);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        describe('and cards are selected from hand', function () {
            beforeEach(function () {
                this.player1.reap(this.kaupeEvilTwin);
                this.player1.clickCard(this.doctorDriscoll);
                this.player1.clickCard(this.detentionCoil);
                this.player1.clickCard(this.transporterPlatform);
                this.player1.clickCard(this.galacticCensus);
                this.player1.clickPrompt('Done');
            });

            it('should discard selected cards', function () {
                expect(this.doctorDriscoll.location).toBe('discard');
                expect(this.detentionCoil.location).toBe('discard');
                expect(this.transporterPlatform.location).toBe('discard');
                expect(this.galacticCensus.location).toBe('discard');
            });

            it('should be able to select enemy creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.gladiodontus);
                expect(this.player1).not.toBeAbleToSelect(this.kaupeEvilTwin);
            });

            describe('and enemy creatures are selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.gladiodontus);
                    this.player1.clickCard(this.gladiodontus);
                    this.player1.clickCard(this.gladiodontus);
                    this.player1.clickCard(this.troll);
                });

                it('should deal 2 * number of discard cards', function () {
                    expect(this.gladiodontus.tokens.damage).toBe(6);
                    expect(this.troll.tokens.damage).toBe(2);
                    this.player1.endTurn();
                });
            });
        });

        it('should be able to discard even when no enemy creatures are in play', function () {
            this.player2.moveCard(this.gladiodontus, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player1.reap(this.kaupeEvilTwin);
            this.player1.clickCard(this.doctorDriscoll);
            this.player1.clickPrompt('Done');
            expect(this.doctorDriscoll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
        });
    });

    describe("Kaupe Evil Twin's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['armsmaster-molina', 'kaupe-evil-twin'],
                    hand: [
                        'commander-chan',
                        'doctor-driscoll',
                        'explo-rover',
                        'uncharted-lands',
                        'transporter-platform',
                        'access-denied',
                        'detention-coil',
                        'stealth-mode',
                        'hazard-zerp',
                        'galactic-census'
                    ]
                },
                player2: {
                    inPlay: ['lamindra', 'troll', 'gladiodontus']
                }
            });
        });

        it('should be able to discard no cards from hand', function () {
            this.player1.fightWith(this.kaupeEvilTwin, this.lamindra);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        describe('and cards are selected from hand', function () {
            beforeEach(function () {
                this.player1.fightWith(this.kaupeEvilTwin, this.lamindra);
                this.player1.clickCard(this.doctorDriscoll);
                this.player1.clickCard(this.detentionCoil);
                this.player1.clickCard(this.transporterPlatform);
                this.player1.clickCard(this.galacticCensus);
                this.player1.clickPrompt('Done');
            });

            it('should discard selected cards', function () {
                expect(this.doctorDriscoll.location).toBe('discard');
                expect(this.detentionCoil.location).toBe('discard');
                expect(this.transporterPlatform.location).toBe('discard');
                expect(this.galacticCensus.location).toBe('discard');
            });

            it('should be able to select enemy creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.gladiodontus);
                expect(this.player1).not.toBeAbleToSelect(this.kaupeEvilTwin);
            });

            describe('and enemy creatures are selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.gladiodontus);
                    this.player1.clickCard(this.gladiodontus);
                    this.player1.clickCard(this.lamindra);
                    this.player1.clickCard(this.troll);
                });

                it('should deal 2 * number of discard cards', function () {
                    expect(this.gladiodontus.tokens.damage).toBe(4);
                    expect(this.troll.tokens.damage).toBe(2);
                    expect(this.lamindra.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });

        it('should correctly count when discarding a Scrap effect', function () {
            this.player1.fightWith(this.kaupeEvilTwin, this.lamindra);
            this.player1.clickCard(this.hazardZerp);
            this.player1.clickCard(this.doctorDriscoll);
            this.player1.clickCard(this.detentionCoil);
            this.player1.clickPrompt('Done');

            // Now we need to select the discard order. If we do Zerp first, we
            // don’t have to choose Detention Coil.
            this.player1.clickCard(this.hazardZerp);

            expect(this.player1).toHavePrompt('Hazard Zerp');
            // Discard the Detention Coil
            this.player1.clickCard(this.detentionCoil);
            // Damage the Troll
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);

            // There were two successful discards, so two instances of damage.
            expect(this.player1).toHavePrompt('Kaupe');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Kaupe');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
