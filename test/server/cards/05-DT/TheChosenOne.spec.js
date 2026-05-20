describe('The Chosen One', function () {
    describe('with a typical board state', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
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
                },
                player2: {
                    amber: 2,
                    house: 'brobnar',
                    inPlay: ['troll', 'valdr', 'the-chosen-one']
                }
            });
        });

        it('does not damage The Chosen One and readies controller creatures at end of controller turn', function () {
            this.player1.clickPrompt('logos');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.reap(this.valdr);
            this.player2.endTurn();

            expect(this.theChosenOne.damage).toBe(0);
            expect(this.troll.exhausted).toBe(false);
            expect(this.valdr.exhausted).toBe(false);

            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 1 damage to The Chosen One for each exhausted opponent creature and prevents readying at end of opponent turn', function () {
            this.player1.clickPrompt('logos');
            this.player1.reap(this.batdrone);
            this.player1.reap(this.dextre);
            this.player1.reap(this.daughter);
            this.player1.useAction(this.hologrammophone);
            this.player1.clickCard(this.daughter);
            this.player1.endTurn();

            expect(this.theChosenOne.damage).toBe(3);
            expect(this.groggins.exhausted).toBe(false);
            expect(this.lollopTheTitanic.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.dextre.exhausted).toBe(true);
            expect(this.daughter.exhausted).toBe(true);
            expect(this.hologrammophone.exhausted).toBe(false);

            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not affect creatures readied outside of the ready phase', function () {
            this.player1.clickPrompt('logos');
            this.player1.reap(this.batdrone);
            this.player1.play(this.helperBot);
            this.player1.play(this.gangerChieftain, true);
            this.player1.clickCard(this.batdrone);

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            this.player1.clickCard(this.troll);

            expect(this.theChosenOne.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('readies opponent creatures when The Chosen One is destroyed before the ready phase', function () {
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.lollopTheTitanic, this.theChosenOne);
            expect(this.theChosenOne.location).toBe('discard');
            this.player1.reap(this.groggins);
            this.player1.endTurn();

            expect(this.lollopTheTitanic.exhausted).toBe(false);
            expect(this.groggins.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.daughter.exhausted).toBe(false);

            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not ready opponent creatures even when The Chosen One is destroyed during the ready phase', function () {
            this.theChosenOne.damage = 8;
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.lollopTheTitanic);
            this.player1.reap(this.groggins);
            this.player1.endTurn();

            expect(this.theChosenOne.location).toBe('discard');
            expect(this.lollopTheTitanic.exhausted).toBe(true);
            expect(this.groggins.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.daughter.exhausted).toBe(false);

            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
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
                    inPlay: ['bumpsy', 'krump']
                }
            });
        });

        it('does not trigger The Chosen One when opponent cannot ready cards due to Storm Surge', function () {
            this.player1.play(this.stormSurge);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.bumpsy);
            this.player2.reap(this.krump);
            this.player2.endTurn();

            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('unfathomable');
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
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('does not trigger The Chosen One when creatures cannot ready due to Thermal Depletion', function () {
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.troll.exhaust();
            this.krump.exhaust();
            this.player2.endTurn();

            expect(this.troll.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with entrenched opponent creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['cabochon', 'remmi-hound']
                },
                player2: { inPlay: ['the-chosen-one'] }
            });

            this.player1.reap(this.cabochon);
            this.player1.reap(this.remmiHound);
            this.player1.endTurn();
        });

        it('does not trigger The Chosen One when no entrenched creature is selected to ready', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickPrompt('done');

            expect(this.cabochon.exhausted).toBe(true);
            expect(this.remmiHound.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });

        it('triggers The Chosen One when at least one entrenched creature is selected to ready', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickCard(this.cabochon);
            this.player1.clickPrompt('done');

            expect(this.cabochon.exhausted).toBe(true);
            expect(this.remmiHound.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(2);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('with an opponent artifact and creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'logos', inPlay: ['hologrammophone', 'dextre'] },
                player2: { inPlay: ['the-chosen-one'] }
            });
        });

        it('is not triggered by an artifact readying and does not count artifacts toward damage', function () {
            this.player1.useAction(this.hologrammophone);
            this.player1.clickCard(this.dextre);
            this.player1.endTurn();

            this.player2.clickPrompt('unfathomable');
            this.player2.endTurn();

            expect(this.hologrammophone.exhausted).toBe(false);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with two The Chosen Ones in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'brobnar', inPlay: ['troll', 'krump'] },
                player2: { inPlay: ['the-chosen-one', 'the-chosen-one'] }
            });
            [this.theChosenOne1, this.theChosenOne2] = this.player2.player.creaturesInPlay.filter(
                (c) => c.id === 'the-chosen-one'
            );
        });

        it('only the chosen The Chosen One takes damage', function () {
            this.player1.reap(this.troll);
            this.player1.reap(this.krump);
            this.player1.endTurn();

            this.player1.clickCard(this.theChosenOne1);
            expect(this.theChosenOne1.damage).toBe(2);
            expect(this.theChosenOne2.damage).toBe(0);
            expect(this.troll.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });
    });

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

    describe('with Under Pressure on an opponent creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['the-chosen-one'],
                    hand: ['under-pressure']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('only counts creatures that actually ready', function () {
            this.player1.playUpgrade(this.underPressure, this.troll);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.endTurn();

            expect(this.troll.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player1.clickPrompt('unfathomable');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with Awakened Titan', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['awakened-titan']
                },
                player2: { inPlay: ['the-chosen-one'] }
            });
        });

        it('does not trigger when the only opponent creature cannot ready', function () {
            this.player1.reap(this.awakenedTitan);
            this.player1.endTurn();

            expect(this.awakenedTitan.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('with Giltspine School', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'priest',
                    inPlay: ['giltspine-school', 'priest:troll', 'priest:krump', 'priest:batdrone']
                },
                player2: { inPlay: ['the-chosen-one'] }
            });
        });

        it('does not trigger when only tokens would ready', function () {
            const [priest1, priest2, priest3] = this.player1.player.creaturesInPlay.filter((c) =>
                c.isToken()
            );
            this.player1.reap(priest1);
            this.player1.reap(priest2);
            this.player1.reap(priest3);
            this.player1.endTurn();

            expect(this.giltspineSchool.exhausted).toBe(false);
            expect(priest1.exhausted).toBe(true);
            expect(priest2.exhausted).toBe(true);
            expect(priest3.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('with Physaloha', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['physaloha', 'bumpsy', 'krump']
                },
                player2: { inPlay: ['the-chosen-one'] }
            });
        });

        it('does not trigger when only damaged creatures would ready', function () {
            this.bumpsy.damage = 1;
            this.krump.damage = 1;
            this.player1.reap(this.bumpsy);
            this.player1.reap(this.krump);
            this.player1.endTurn();

            expect(this.physaloha.exhausted).toBe(false);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.theChosenOne.damage).toBe(0);

            this.player2.clickPrompt('unfathomable');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
