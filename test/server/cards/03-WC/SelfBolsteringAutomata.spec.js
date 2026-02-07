describe('Self-Bolstering Automata', function () {
    describe('destroyed ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['self-bolstering-automata', 'pip-pip'],
                    hand: ['bouncing-deathquark', 'positron-bolt']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        describe('when other creatures are in play', function () {
            describe('and automata is destroyed', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.selfBolsteringAutomata, this.troll);
                    this.player1.clickPrompt('right');
                });

                it('should fully heal automata, not destroy it, exhaust it and move it to the right flank', function () {
                    expect(this.selfBolsteringAutomata.damage).toBe(0);
                    expect(this.selfBolsteringAutomata.location).toBe('play area');
                    expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                    expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                });

                it('should not gain 2 +1 power counters since it was exhausted by fighting', function () {
                    expect(this.selfBolsteringAutomata.powerCounters).toBe(0);
                });
            });
        });

        describe('when no other creatures are in play', function () {
            describe('and automata is destroyed', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.pipPip, 'discard');
                    this.player1.fightWith(this.selfBolsteringAutomata, this.troll);
                });

                it('should not stop automata from being destroyed', function () {
                    expect(this.selfBolsteringAutomata.location).toBe('discard');
                });
            });
        });

        describe('when destroyed with damage', function () {
            beforeEach(function () {
                this.pipPip.ward();
                this.player1.play(this.positronBolt);
                this.player1.clickCard(this.selfBolsteringAutomata);
                this.player1.clickCard(this.pipPip);
            });

            it('should fully heal automata, not destroy it, exhaust it and move it to the right flank and get 2 +1 power counters', function () {
                expect(this.player1).toHavePrompt('Self-Bolstering Automata');
                this.player1.clickPrompt('right');
                expect(this.selfBolsteringAutomata.damage).toBe(0);
                expect(this.selfBolsteringAutomata.location).toBe('play area');
                expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                expect(this.selfBolsteringAutomata.powerCounters).toBe(2);
            });
        });

        describe('when destroyed without damage', function () {
            beforeEach(function () {
                this.player1.play(this.bouncingDeathquark);
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.selfBolsteringAutomata);
                expect(this.player1).toHavePrompt('Self-Bolstering Automata');
                this.player1.clickPrompt('right');
                // Stop Bouncing Deathquark from repeating
                this.player1.clickPrompt('No');
            });

            it('should fully heal automata, not destroy it, exhaust it and move it to the right flank but not get power counters since no damage was healed', function () {
                expect(this.selfBolsteringAutomata.damage).toBe(0);
                expect(this.selfBolsteringAutomata.location).toBe('play area');
                expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                // No power counters because there was no damage to heal
                expect(this.selfBolsteringAutomata.powerCounters).toBe(0);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when destroyed by Axiom of Grisk from Jargogle', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['nurse-soto', 'self-bolstering-automata'],
                    hand: ['jargogle', 'axiom-of-grisk']
                },
                player2: {
                    inPlay: ['brain-eater']
                }
            });
        });

        it('should not cause an infinite loop', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.axiomOfGrisk);
            this.jargogle.ready();
            this.player1.fightWith(this.jargogle, this.brainEater);
            this.player1.clickCard(this.nurseSoto);
            this.player1.clickPrompt('Left');

            expect(this.jargogle.location).toBe('discard');
            expect(this.axiomOfGrisk.location).toBe('discard');
            expect(this.selfBolsteringAutomata.location).toBe('play area');
            expect(this.player1.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with Shield-U-Later Evil Twin upgrade', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['self-bolstering-automata', 'dodger'],
                    hand: ['plague-wind']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should immediately trigger replacement when upgrade reduces power to negative and gain 2 +1 power counters and not cause infinite loop', function () {
            // Attach Shield-U-Later Evil Twin as upgrade (gives -2 power, so SBA power 1 -> -1)
            // This immediately triggers destruction which SBA replaces
            this.selfBolsteringAutomata.powerCounters = 1; // Set power to 1 so that it goes to -1 after attaching the upgrade
            this.selfBolsteringAutomata.damage = 1;
            this.player1.play(this.plagueWind);
            expect(this.player1).toHavePrompt('Self-Bolstering Automata');
            this.player1.clickPrompt('Right');

            // Self-Bolstering Automata gains power counters and survives
            expect(this.selfBolsteringAutomata.location).toBe('play area');
            expect(this.selfBolsteringAutomata.damage).toBe(0);
            expect(this.selfBolsteringAutomata.exhausted).toBe(true);
            expect(this.selfBolsteringAutomata.powerCounters).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        // TODO: This create a true infinite loop that needs to be handled
        // https://github.com/keyteki/keyteki/issues/2778
        it.skip('should not gain power counters when already exhausted and be destroyed', function () {
            // Plague Wind gives -3 power, so SBA with power 2 (1 base + 1 counter) goes to -1
            // This immediately triggers destruction which SBA replaces
            this.selfBolsteringAutomata.exhaust();
            this.selfBolsteringAutomata.powerCounters = 1;
            this.selfBolsteringAutomata.damage = 1;
            this.player1.play(this.plagueWind);
            expect(this.player1).toHavePrompt('Self-Bolstering Automata');
            this.player1.clickPrompt('Right');

            // SBA doesn't gain counters (already exhausted), so power stays -1 and it's destroyed
            expect(this.selfBolsteringAutomata.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
