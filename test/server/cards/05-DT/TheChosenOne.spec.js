describe('The Chosen One', function () {
    describe('with a typical board state', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'brobnar',
                    inPlay: ['troll', 'valdr', 'the-chosen-one']
                },
                player2: {
                    amber: 1,
                    inPlay: [
                        'batdrone',
                        'dextre',
                        'lollop-the-titanic',
                        'daughter',
                        'groggins',
                        'hologrammophone'
                    ],
                    hand: ['helper-bot', 'ganger-chieftain']
                }
            });
        });

        it('does not damage TCO and readies controller creatures at end of controller turn', function () {
            // TCO's controller ends their turn: the mass ready phase belongs
            // to player1, so TCO should not trigger against itself.
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // TCO takes no damage and friendly creatures ready normally.
            expect(this.theChosenOne.damage).toBe(0);
            expect(this.troll.exhausted).toBe(false);
            expect(this.valdr.exhausted).toBe(false);

            this.player2.clickPrompt('logos');
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 1 damage to TCO for each exhausted opponent creature and prevents readying at end of opponent turn', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Opponent exhausts three creatures during their turn.
            this.player2.clickPrompt('logos');
            this.player2.reap(this.batdrone);
            this.player2.reap(this.dextre);
            this.player2.reap(this.daughter);
            this.player2.useAction(this.hologrammophone);
            this.player2.clickCard(this.daughter);
            this.player2.endTurn();

            // TCO cancels the mass ready and takes 1 damage per exhausted
            // opponent creature (3); creatures stay exhausted. The unrelated
            // artifact is not counted and readies normally.
            expect(this.theChosenOne.damage).toBe(3);
            expect(this.groggins.exhausted).toBe(false);
            expect(this.lollopTheTitanic.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.dextre.exhausted).toBe(true);
            expect(this.daughter.exhausted).toBe(true);
            expect(this.hologrammophone.exhausted).toBe(false);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not affect creatures readied outside of the ready phase', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Ganger Chieftain's Play ability readies another creature. This
            // is a card-effect ready, not the mass ready phase, so TCO must
            // not interfere -- including not removing valid targets from the
            // selection prompt.
            this.player2.clickPrompt('logos');
            this.player2.reap(this.batdrone);
            this.player2.play(this.helperBot);
            this.player2.play(this.gangerChieftain, true);
            this.player2.clickCard(this.batdrone);

            // Ready opponent creatures remain selectable as Ready targets.
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.valdr);
            this.player2.clickCard(this.troll);

            expect(this.player2).isReadyToTakeAction();
        });

        it('readies opponent creatures when TCO is destroyed before the ready phase', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Opponent kills TCO during their turn, then exhausts a creature.
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.lollopTheTitanic, this.theChosenOne);
            expect(this.theChosenOne.location).toBe('discard');
            this.player2.reap(this.groggins);
            this.player2.endTurn();

            // With TCO gone, the mass ready resolves normally.
            expect(this.lollopTheTitanic.exhausted).toBe(false);
            expect(this.groggins.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.daughter.exhausted).toBe(false);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not ready opponent creatures even when TCO is destroyed during the ready phase', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Pre-damage TCO so the ready-phase damage will kill it.
            this.theChosenOne.damage = 8;
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.lollopTheTitanic);
            this.player2.reap(this.groggins);
            this.player2.endTurn();

            // TCO triggers, cancels the ready, then dies from the damage.
            // The cancellation still applies, so exhausted creatures stay
            // exhausted (TCO already replaced the ready before dying).
            expect(this.theChosenOne.location).toBe('discard');
            expect(this.lollopTheTitanic.exhausted).toBe(true);
            expect(this.groggins.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.daughter.exhausted).toBe(false);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with Storm Surge', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['the-chosen-one'],
                    hand: ['storm-surge']
                },
                player2: {
                    inPlay: ['troll', 'helichopper']
                }
            });
        });

        it('does not trigger TCO when opponent cannot ready cards due to Storm Surge', function () {
            this.player1.play(this.stormSurge);
            this.player1.endTurn();

            // With Storm Surge active, opponent's creatures cannot ready at
            // all, so no ready event is raised and TCO does not trigger.
            this.troll.exhaust();
            this.helichopper.exhaust();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.troll.exhausted).toBe(true);
            expect(this.helichopper.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with Thermal Depletion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['the-chosen-one'],
                    hand: ['thermal-depletion']
                },
                player2: {
                    inPlay: ['troll', 'helichopper']
                }
            });
        });

        it('does not trigger TCO when creatures cannot ready due to Thermal Depletion', function () {
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();

            // Thermal Depletion also prevents creatures from readying, so
            // no ready event fires and TCO has nothing to interrupt.
            this.troll.exhaust();
            this.helichopper.exhaust();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.troll.exhausted).toBe(true);
            expect(this.helichopper.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    // Representative test for the broader family of per-card "do not
    // ready" effects: Kiri Giltspine, Physaloha, Frost Giant,
    // Awakened Titan, Under Pressure, and entrench. If no creature
    // actually readies, TCO has nothing to replace and deals no
    // damage; if any creature would ready, TCO triggers and deals
    // damage for each exhausted opponent creature.
    describe('with entrenched opponent creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { inPlay: ['the-chosen-one'] },
                player2: { inPlay: ['grammy-taps', 'knuckler'] }
            });

            this.grammyTaps.exhaust();
            this.knuckler.exhaust();
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
        });

        it('does not trigger TCO when no entrenched creature is selected to ready', function () {
            // Decline to ready any entrenched creatures: no ready event is
            // raised, so TCO does not trigger.
            expect(this.player2).toHavePrompt('Select entrenched creatures to ready');
            this.player2.clickPrompt('done');

            expect(this.grammyTaps.exhausted).toBe(true);
            expect(this.knuckler.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers TCO when at least one entrenched creature is selected to ready', function () {
            // Select Grammy Taps to ready: a ready event is raised, TCO
            // interrupts it and replaces it with damage to itself.
            expect(this.player2).toHavePrompt('Select entrenched creatures to ready');
            this.player2.clickCard(this.grammyTaps);
            this.player2.clickPrompt('done');

            // TCO prevents creature readying, so both stay exhausted, and
            // TCO takes one damage per exhausted opponent creature.
            expect(this.grammyTaps.exhausted).toBe(true);
            expect(this.knuckler.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(2);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with an opponent artifact and creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { inPlay: ['the-chosen-one'] },
                player2: { inPlay: ['hologrammophone', 'troll'] }
            });
        });

        it('is not triggered by an artifact readying and does not count artifacts toward damage', function () {
            // Exhaust both an artifact and a creature, then let opponent's
            // ready phase fire.
            this.hologrammophone.exhaust();
            this.troll.exhaust();
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // TCO triggers because Troll (a creature) would ready. Damage = 1
            // (just Troll); the exhausted artifact (Hologrammophone) is not
            // counted, and TCO did not block the artifact from readying.
            expect(this.theChosenOne.damage).toBe(1);
            expect(this.hologrammophone.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with two TCOs in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { inPlay: ['the-chosen-one', 'the-chosen-one'] },
                player2: { inPlay: ['troll', 'helichopper'] }
            });
        });

        it('only the chosen TCO takes damage', function () {
            const [tco1, tco2] = this.player1.player.creaturesInPlay.filter(
                (c) => c.id === 'the-chosen-one'
            );

            this.troll.exhaust();
            this.helichopper.exhaust();
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // Both TCOs interrupt onCardsReadied. The active player (player2,
            // whose ready phase it is) is prompted to choose the order. The
            // first TCO to resolve replaces the readying and takes the damage.
            // The second TCO re-evaluates its when condition and sees
            // event.cards has no creatures left, so it does not trigger.
            this.player2.clickCard(tco1);

            expect(tco1.damage).toBe(2);
            expect(tco2.damage).toBe(0);
            expect(this.troll.exhausted).toBe(true);
            expect(this.helichopper.exhausted).toBe(true);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    // "Does not ready" specifically refers to the mass ready in the
    // standard ready phase. A chain like Chosen One + Soulkeeper + Big
    // Jargogle + Ganger Chieftain + Frost Giant should still attempt to
    // ready (since the chain produces real ready operations outside the
    // ready phase / pushes other creatures through), so Chosen One should
    // cancel and take damage.
    describe('with a Jargogle / Ganger Chieftain ready chain through Frost Giant', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['soulkeeper'],
                    inPlay: ['the-chosen-one']
                },
                player2: {
                    hand: ['jargogle', 'ganger-chieftain'],
                    inPlay: ['frost-giant']
                }
            });
        });

        it('cancels and takes damage when the chain triggers a ready', function () {
            // Setup: Soulkeeper on TCO so it survives the lethal damage,
            // Frost Giant exhausted on the opposing side.
            this.frostGiant.exhaust();
            this.player1.playUpgrade(this.soulkeeper, this.theChosenOne);
            this.player1.endTurn();

            // Opponent plays Big Jargogle and stashes Ganger Chieftain under it.
            this.player2.clickPrompt('logos');
            this.player2.play(this.jargogle);
            this.player2.clickCard(this.gangerChieftain);

            // Pre-conditions to force the desired chain: Jargogle has enough
            // power counters to die during the ready phase, and TCO is one
            // hit from dying (Soulkeeper will save it).
            this.jargogle.powerCounters = 20;
            this.theChosenOne.damage = 8;
            this.player2.endTurn();

            // Ready phase: Jargogle dies, plays Ganger Chieftain, whose
            // Play readies Frost Giant. "doesNotReady" only blocks the mass
            // ready -- card-effect readies still raise an onCardsReadied
            // event, so TCO triggers and replaces it with damage.
            expect(this.theChosenOne.damage).toBe(10);

            // Resolve Jargogle's destroyed trigger: play Ganger Chieftain.
            this.player2.clickCard(this.jargogle);
            this.player2.clickPrompt('left');
            this.player2.clickCard(this.frostGiant);

            // Frost Giant was not actually readied -- TCO cancelled the ready.
            expect(this.frostGiant.exhausted).toBe(true);
            this.player2.clickCard(this.dextre);

            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
