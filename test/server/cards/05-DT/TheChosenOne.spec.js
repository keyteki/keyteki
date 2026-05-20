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

        it('does not damage The Chosen One and readies controller creatures at end of controller turn', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            expect(this.theChosenOne.damage).toBe(0);
            expect(this.troll.exhausted).toBe(false);
            expect(this.valdr.exhausted).toBe(false);

            this.player2.clickPrompt('logos');
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 1 damage to The Chosen One for each exhausted opponent creature and prevents readying at end of opponent turn', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.reap(this.batdrone);
            this.player2.reap(this.dextre);
            this.player2.reap(this.daughter);
            this.player2.useAction(this.hologrammophone);
            this.player2.clickCard(this.daughter);
            this.player2.endTurn();

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

            this.player2.clickPrompt('logos');
            this.player2.reap(this.batdrone);
            this.player2.play(this.helperBot);
            this.player2.play(this.gangerChieftain, true);
            this.player2.clickCard(this.batdrone);

            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.valdr);
            this.player2.clickCard(this.troll);

            expect(this.player2).isReadyToTakeAction();
        });

        it('readies opponent creatures when The Chosen One is destroyed before the ready phase', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Opponent kills The Chosen One during their turn, then exhausts a creature.
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.lollopTheTitanic, this.theChosenOne);
            expect(this.theChosenOne.location).toBe('discard');
            this.player2.reap(this.groggins);
            this.player2.endTurn();

            // With The Chosen One gone, the mass ready resolves normally.
            expect(this.lollopTheTitanic.exhausted).toBe(false);
            expect(this.groggins.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.daughter.exhausted).toBe(false);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not ready opponent creatures even when The Chosen One is destroyed during the ready phase', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.valdr);
            this.player1.endTurn();

            // Pre-damage The Chosen One so the ready-phase damage will kill it.
            this.theChosenOne.damage = 8;
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.lollopTheTitanic);
            this.player2.reap(this.groggins);
            this.player2.endTurn();

            // The Chosen One triggers, cancels the ready, then dies from the damage.
            // The cancellation still applies, so exhausted creatures stay
            // exhausted (The Chosen One already replaced the ready before dying).
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

        it('does not trigger The Chosen One when opponent cannot ready cards due to Storm Surge', function () {
            this.player1.play(this.stormSurge);
            this.player1.endTurn();

            // With Storm Surge active, opponent's creatures cannot ready at
            // all, so no ready event is raised and The Chosen One does not trigger.
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

        it('does not trigger The Chosen One when creatures cannot ready due to Thermal Depletion', function () {
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();

            // Thermal Depletion also prevents creatures from readying, so
            // no ready event fires and The Chosen One has nothing to interrupt.
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
    // actually readies, The Chosen One has nothing to replace and deals no
    // damage; if any creature would ready, The Chosen One triggers and deals
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

        it('does not trigger The Chosen One when no entrenched creature is selected to ready', function () {
            // Decline to ready any entrenched creatures: no ready event is
            // raised, so The Chosen One does not trigger.
            expect(this.player2).toHavePrompt('Select entrenched creatures to ready');
            this.player2.clickPrompt('done');

            expect(this.grammyTaps.exhausted).toBe(true);
            expect(this.knuckler.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers The Chosen One when at least one entrenched creature is selected to ready', function () {
            // Select Grammy Taps to ready: a ready event is raised, The Chosen One
            // interrupts it and replaces it with damage to itself.
            expect(this.player2).toHavePrompt('Select entrenched creatures to ready');
            this.player2.clickCard(this.grammyTaps);
            this.player2.clickPrompt('done');

            // The Chosen One prevents creature readying, so both stay exhausted, and
            // The Chosen One takes one damage per exhausted opponent creature.
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

            // The Chosen One triggers because Troll (a creature) would ready. Damage = 1
            // (just Troll); the exhausted artifact (Hologrammophone) is not
            // counted, and The Chosen One did not block the artifact from readying.
            expect(this.theChosenOne.damage).toBe(1);
            expect(this.hologrammophone.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);

            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with two The Chosen Ones in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { inPlay: ['the-chosen-one', 'the-chosen-one'] },
                player2: { inPlay: ['troll', 'helichopper'] }
            });
        });

        it('only the chosen The Chosen One takes damage', function () {
            const [theChosenOne1, theChosenOne2] = this.player1.player.creaturesInPlay.filter(
                (c) => c.id === 'the-chosen-one'
            );

            this.troll.exhaust();
            this.helichopper.exhaust();
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // Both The Chosen Ones interrupt onCardsReadied. The active player (player2,
            // whose ready phase it is) is prompted to choose the order. The
            // first The Chosen One to resolve replaces the readying and takes the damage.
            // The second The Chosen One re-evaluates its when condition and sees
            // event.cards has no creatures left, so it does not trigger.
            this.player2.clickCard(theChosenOne1);

            expect(theChosenOne1.damage).toBe(2);
            expect(theChosenOne2.damage).toBe(0);
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
                    hand: ['soulkeeper', 'armageddon-cloak'],
                    inPlay: ['the-chosen-one', 'almsmaster-evil-twin']
                },
                player2: {
                    hand: ['jargogle', 'ganger-chieftain'],
                    inPlay: ['frost-giant']
                }
            });
            this.player1.makeMaverick(this.armageddonCloak, 'dis');
        });

        it('cancels and takes damage when the chain triggers a ready', function () {
            this.frostGiant.exhaust();
            this.player1.playUpgrade(this.armageddonCloak, this.theChosenOne);
            this.player1.playUpgrade(this.soulkeeper, this.theChosenOne);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.jargogle);
            this.player2.clickCard(this.gangerChieftain);
            this.jargogle.powerCounters = 20;
            this.theChosenOne.damage = 8;
            this.player2.endTurn();

            // Player2 ready phase - soulkeeper destroys Jargogle
            expect(this.theChosenOne.damage).toBe(10);
            this.player2.clickPrompt(this.soulkeeper.name);
            this.player2.clickCard(this.jargogle);

            // Jargogle plays Ganger Chieftain
            this.player2.clickPrompt('left');
            this.player2.clickCard(this.frostGiant);

            // Frost Giant does not ready due to The Chosen One
            expect(this.frostGiant.exhausted).toBe(true);
            expect(this.gangerChieftain.location).toBe('play area');
            expect(this.gangerChieftain.exhausted).toBe(true);

            // Almsmaster Evil Twin and Armageddon Cloak prompt here, allowing The Chosen One's damage to be checked
            expect(this.player2).toHavePrompt('Which ability would you like to use?');
            expect(this.theChosenOne.damage).toBe(13);

            // Turn finishes
            this.player2.clickPrompt(this.almsmasterEvilTwin.name);
            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
