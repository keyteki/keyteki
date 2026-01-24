describe('Triggered Ability Window', function () {
    describe("Loot the Bodies's cancellation and auto resolution", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['loot-the-bodies', 'loot-the-bodies', 'ballcano']
                },
                player2: {
                    inPlay: ['bad-penny', 'dextre', 'rad-penny', 'boss-zarek']
                }
            });

            this.lootTheBodies2 = this.player1.player.hand[1];
            this.game.manualMode = true;
        });

        it('should be able to cancel all prompts', function () {
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.lootTheBodies2);
            this.player1.play(this.ballcano);

            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.radPenny);
            expect(this.player1).not.toBeAbleToSelect(this.bossZarek);
            expect(this.player1).toHavePromptButton('Autoresolve');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Cancel Prompt');

            expect(this.player1.amber).toBe(0);
            expect(this.badPenny.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.radPenny.location).toBe('discard');
            expect(this.bossZarek.location).toBe('discard');

            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Autoresolve');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Cancel Prompt');

            expect(this.player1.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should be able to cancel loot the bodies prompt', function () {
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.lootTheBodies2);
            this.player1.play(this.ballcano);

            this.player1.clickCard(this.badPenny);
            this.player1.clickCard(this.radPenny);

            expect(this.player1.amber).toBe(0);
            expect(this.badPenny.location).toBe('hand');
            expect(this.dextre.location).toBe('deck');
            expect(this.radPenny.location).toBe('deck');
            expect(this.bossZarek.location).toBe('discard');

            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Cancel Prompt');

            expect(this.player1.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should be able to auto resolve destruction prompt and cancel Loot the Bodies', function () {
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.lootTheBodies2);
            this.player1.play(this.ballcano);

            this.player1.clickPrompt('Autoresolve');

            expect(this.player1.amber).toBe(0);
            expect(this.badPenny.location).toBe('hand');
            expect(this.dextre.location).toBe('deck');
            expect(this.radPenny.location).toBe('deck');
            expect(this.bossZarek.location).toBe('discard');

            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Cancel Prompt');

            expect(this.player1.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should be able to auto resolve both prompts', function () {
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.lootTheBodies2);
            this.player1.play(this.ballcano);

            this.player1.clickPrompt('Autoresolve');

            expect(this.player1.amber).toBe(0);
            expect(this.badPenny.location).toBe('hand');
            expect(this.dextre.location).toBe('deck');
            expect(this.radPenny.location).toBe('deck');
            expect(this.bossZarek.location).toBe('discard');

            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Loot the Bodies');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            expect(this.player1).toHavePromptButton('Autoresolve');
            this.player1.clickPrompt('Autoresolve');

            expect(this.player1.amber).toBe(8);

            this.player1.endTurn();
        });
    });

    describe("Sensor Chief Garcia and upgrade's cancellation and auto resolution", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['sensor-chief-garcia', 'armsmaster-molina'],
                    hand: [
                        'force-field',
                        'observ-u-max',
                        'disruption-field',
                        'ingram-s-blaster',
                        'stunner'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny', 'dextre', 'rad-penny', 'boss-zarek']
                }
            });

            this.player1.playUpgrade(this.forceField, this.sensorChiefGarcia); // +1A
            this.player1.playUpgrade(this.observUMax, this.sensorChiefGarcia); // +1A
            this.player1.playUpgrade(this.disruptionField, this.sensorChiefGarcia); // +1A
            this.game.manualMode = true;
        });

        it('should not have auto resolve if there is an optional ability', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.sensorChiefGarcia);
            this.player1.reap(this.sensorChiefGarcia);

            expect(this.player1).not.toHavePromptButton('Autoresolve');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
        });

        it('should be able to cancel Garcia ability prompt', function () {
            this.player1.reap(this.sensorChiefGarcia); // +1A

            expect(this.player1).toHavePromptButton('Autoresolve');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Cancel Prompt');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.sensorChiefGarcia.amber).toBe(0);
            expect(this.sensorChiefGarcia.warded).toBe(false);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it('should not be able to go Back from ability', function () {
            this.player1.reap(this.sensorChiefGarcia); // +1A
            expect(this.player1).not.toHavePromptButton('Back');
        });

        it('should be able to auto resolve on Garcia ability prompt', function () {
            this.player1.reap(this.sensorChiefGarcia); // +1A
            expect(this.player1).toHavePromptButton('Autoresolve');
            expect(this.player1).toHavePromptButton('Cancel Prompt');
            this.player1.clickPrompt('Autoresolve');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.amber).toBe(1);
            expect(this.sensorChiefGarcia.warded).toBe(true);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(8); // Garcia
            expect(this.player2.player.getCurrentKeyCost()).toBe(9); // Garcia + Disruption Field
        });

        it('should be able to resolve abilities one by one', function () {
            this.player1.reap(this.sensorChiefGarcia); // +1A

            this.player1.clickPrompt('Sensor Chief Garcia');
            this.player1.clickPrompt('Observ-u-Max');
            this.player1.clickPrompt('Disruption Field');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.amber).toBe(1);
            expect(this.sensorChiefGarcia.warded).toBe(true);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(8); // Garcia
            expect(this.player2.player.getCurrentKeyCost()).toBe(9); // Garcia + Disruption Field
        });

        it('should be able to auto resolve after resolving optional ability', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.sensorChiefGarcia); // +1A
            this.player1.reap(this.sensorChiefGarcia); // +1A

            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.clickPrompt('Ingram’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.bossZarek);
            expect(this.bossZarek.damage).toBe(2);
            this.player1.clickPrompt('Autoresolve');

            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.amber).toBe(1);
            expect(this.sensorChiefGarcia.warded).toBe(true);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(8); // Garcia
            expect(this.player2.player.getCurrentKeyCost()).toBe(9); // Garcia + Disruption Field
        });

        it('should be able to resolve abilities one by one after resolving optional ability', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.sensorChiefGarcia); // +1A
            this.player1.reap(this.sensorChiefGarcia); // +1A

            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.clickPrompt('Ingram’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.bossZarek);
            expect(this.bossZarek.damage).toBe(2);
            this.player1.clickPrompt('Sensor Chief Garcia');
            this.player1.clickPrompt('Observ-u-Max');
            this.player1.clickPrompt('Disruption Field');

            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.amber).toBe(1);
            expect(this.sensorChiefGarcia.warded).toBe(true);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(8); // Garcia
            expect(this.player2.player.getCurrentKeyCost()).toBe(9); // Garcia + Disruption Field
        });

        it('should be able to resolve abilities one by one and opt out optional at the end', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.sensorChiefGarcia); // +1A
            this.player1.reap(this.sensorChiefGarcia); // +1A

            this.player1.clickPrompt('Sensor Chief Garcia');
            this.player1.clickPrompt('Observ-u-Max');
            this.player1.clickPrompt('Disruption Field');
            this.player1.clickPrompt('Force Field');

            expect(this.player1).toBeAbleToSelect(this.sensorChiefGarcia);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Autoresolve');

            this.player1.clickPrompt('Done');

            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(2);
            expect(this.sensorChiefGarcia.amber).toBe(1);
            expect(this.sensorChiefGarcia.warded).toBe(true);

            this.player1.endTurn();

            expect(this.player1.player.getCurrentKeyCost()).toBe(8); // Garcia
            expect(this.player2.player.getCurrentKeyCost()).toBe(9); // Garcia + Disruption Field
        });

        it('should be able to opt out two optional abilities on first prompt', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.armsmasterMolina);
            this.player1.playUpgrade(this.stunner, this.armsmasterMolina);
            this.player1.reap(this.armsmasterMolina);

            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Autoresolve');

            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should be able to opt in first optional ability and opt out second', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.armsmasterMolina);
            this.player1.playUpgrade(this.stunner, this.armsmasterMolina);
            this.player1.reap(this.armsmasterMolina);

            this.player1.clickCard(this.armsmasterMolina);

            expect(this.player1).toHavePromptButton('Stunner');
            expect(this.player1).toHavePromptButton('Ingram’s Blaster');

            this.player1.clickPrompt('Stunner');
            this.player1.clickCard(this.bossZarek);
            expect(this.bossZarek.stunned).toBe(true);

            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Autoresolve');

            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should be able to opt in both optional abilities', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.armsmasterMolina);
            this.player1.playUpgrade(this.stunner, this.armsmasterMolina);
            this.player1.reap(this.armsmasterMolina);

            this.player1.clickCard(this.armsmasterMolina);

            expect(this.player1).toHavePromptButton('Stunner');
            expect(this.player1).toHavePromptButton('Ingram’s Blaster');

            this.player1.clickPrompt('Stunner');
            this.player1.clickCard(this.bossZarek);
            expect(this.bossZarek.stunned).toBe(true);

            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Autoresolve');

            this.player1.clickCard(this.armsmasterMolina);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.bossZarek);
            expect(this.bossZarek.damage).toBe(2);

            this.player1.endTurn();
        });
    });

    describe('Multiply play abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['fila-the-researcher'],
                    hand: ['charge', 'ardent-hero', 'almsmaster', 'dino-knight', 'commandeer']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'brammo', 'boss-zarek', 'autocannon']
                }
            });

            this.game.manualMode = true;
            this.player1.play(this.charge);
        });

        describe('when played a creature without a play ability, Ardent Hero', function () {
            beforeEach(function () {
                this.player1.play(this.ardentHero);
            });

            it('should be able to cancel Ardent Hero first prompt', function () {
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.autocannon);
                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.damage).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel after resolving Autocannon', function () {
                this.player1.clickCard(this.autocannon);

                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.damage).toBe(1);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel Charge! target and finish prompting', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.ardentHero);

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.damage).toBe(1);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });

            it('should finish after choosing Charge! target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.ardentHero);
                this.player1.clickCard(this.troll);

                expect(this.ardentHero.damage).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });
        });

        describe('when played a creature with a play ability, Almsmaster', function () {
            beforeEach(function () {
                this.player1.play(this.almsmaster);
            });

            it('should be able to cancel Almsmaster first prompt', function () {
                expect(this.player1).toBeAbleToSelect(this.almsmaster);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.autocannon);
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.almsmaster.armorUsed).toBe(0);
                expect(this.filaTheResearcher.amber).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel after resolving Autocannon', function () {
                this.player1.clickCard(this.autocannon);

                expect(this.player1).toBeAbleToSelect(this.almsmaster);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.almsmaster.armorUsed).toBe(1);
                expect(this.filaTheResearcher.amber).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to choose Almsmaster, go back and cancel prompt', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.almsmaster);

                expect(this.player1).not.toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toHavePromptButton('Charge!');
                expect(this.player1).toHavePromptButton('Almsmaster');
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Back');
                expect(this.player1).not.toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Back');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.almsmaster.armorUsed).toBe(1);
                expect(this.filaTheResearcher.amber).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel Charge! target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.almsmaster);
                this.player1.clickPrompt('Charge!');

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.almsmaster.armorUsed).toBe(1);
                expect(this.filaTheResearcher.amber).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.almsmaster);
            });

            it('should finish after choosing Charge! target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.almsmaster);
                this.player1.clickPrompt('Almsmaster');
                this.player1.clickCard(this.almsmaster);
                this.player1.clickCard(this.troll);

                expect(this.almsmaster.armorUsed).toBe(1);
                expect(this.filaTheResearcher.amber).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });
        });

        describe('when played a creature with an optional play ability, Dino-Knight', function () {
            beforeEach(function () {
                this.player1.play(this.dinoKnight);
            });

            it('should be able to cancel Dino-Knight first prompt', function () {
                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.autocannon);
                expect(this.player1).not.toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.dinoKnight.armorUsed).toBe(0);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel after resolving Autocannon', function () {
                this.player1.clickCard(this.autocannon);

                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).not.toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel Charge! target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.dinoKnight);
                this.player1.clickPrompt('Charge!');

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.player1.hand.length).toBe(3);

                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).not.toHavePromptButton('Charge!');
                expect(this.player1).not.toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
            });

            it('should opt to out optional ability', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.dinoKnight);
                this.player1.clickPrompt('Charge!');
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.filaTheResearcher);

                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });

            it('should be able to trigger optional ability and Cancel target prompt', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.dinoKnight);
                this.player1.clickPrompt('Charge!');
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.filaTheResearcher);

                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.dinoKnight);

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.dinoKnight.amber).toBe(1);
                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });

            it('should be able to trigger optional ability and select a target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.dinoKnight);
                this.player1.clickPrompt('Charge!');
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.filaTheResearcher);

                expect(this.player1).toBeAbleToSelect(this.dinoKnight);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.dinoKnight);

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickCard(this.troll);

                expect(this.dinoKnight.amber).toBe(1);
                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.troll.damage).toBe(5);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });

            it('should be able to autoresolve after finishing optional ability', function () {
                this.player1.clickCard(this.dinoKnight);
                this.player1.clickPrompt('Dino-Knight');
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickCard(this.troll);
                this.player1.clickPrompt('Autoresolve');
                this.player1.clickCard(this.troll); // Charge! targetting

                expect(this.dinoKnight.amber).toBe(1);
                expect(this.dinoKnight.armorUsed).toBe(1);
                expect(this.troll.damage).toBe(5);
                expect(this.player1.hand.length).toBe(4);

                this.player1.endTurn();
            });
        });

        describe('when played together with another lasting effect', function () {
            beforeEach(function () {
                this.player1.play(this.commandeer);
                this.player1.play(this.ardentHero);
            });

            it('should be able to cancel Ardent Hero first prompt', function () {
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.autocannon);
                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toHavePromptButton('Commandeer');
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.amber).toBe(0);
                expect(this.ardentHero.damage).toBe(0);
                expect(this.player1.hand.length).toBe(2);

                this.player1.endTurn();
            });

            it('should be able to cancel after resolving Autocannon', function () {
                this.player1.clickCard(this.autocannon);

                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toHavePromptButton('Commandeer');
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.amber).toBe(0);
                expect(this.ardentHero.damage).toBe(1);
                expect(this.player1.hand.length).toBe(2);

                this.player1.endTurn();
            });

            it('should be able to cancel after resolving Fila the Researcher', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.filaTheResearcher);

                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toHavePromptButton('Commandeer');
                expect(this.player1).toHavePromptButton('Autoresolve');
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.amber).toBe(0);
                expect(this.ardentHero.damage).toBe(1);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to cancel Charge! and Commandeer targets', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.filaTheResearcher);
                this.player1.clickCard(this.ardentHero);

                expect(this.player1).toHavePrompt('Charge!');
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.bossZarek);
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.player1).toHavePrompt('Commandeer');
                expect(this.player1).toBeAbleToSelect(this.ardentHero);
                expect(this.player1).toBeAbleToSelect(this.filaTheResearcher);
                expect(this.player1).toHavePromptButton('Cancel Prompt');
                this.player1.clickPrompt('Cancel Prompt');

                expect(this.ardentHero.amber).toBe(0);
                expect(this.ardentHero.damage).toBe(1);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should finish after choosing Charge! target', function () {
                this.player1.clickCard(this.autocannon);
                this.player1.clickCard(this.filaTheResearcher);
                this.player1.clickPrompt('Commandeer');
                expect(this.player1).toHavePrompt('Commandeer');
                this.player1.clickCard(this.ardentHero);
                expect(this.player1).toHavePrompt('Charge!');
                this.player1.clickCard(this.troll);

                expect(this.ardentHero.amber).toBe(1);
                expect(this.ardentHero.damage).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });

            it('should be able to Autoresolve and prompt for Charge! and Commandeer targets', function () {
                this.player1.clickPrompt('Autoresolve');
                expect(this.player1).toHavePrompt('Charge!');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Commandeer');
                this.player1.clickCard(this.ardentHero);

                expect(this.ardentHero.amber).toBe(1);
                expect(this.ardentHero.damage).toBe(1);
                expect(this.troll.damage).toBe(2);
                expect(this.player1.hand.length).toBe(3);

                this.player1.endTurn();
            });
        });
    });

    describe('Same source for reap abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['rotgrub', 'dino-bot', 'kompsos-haruspex'],
                    hand: ['dust-imp']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'brammo', 'boss-zarek', 'autocannon']
                }
            });

            this.game.manualMode = true;
        });

        it('should prompt for the play or reap abilities', function () {
            this.player1.reap(this.rotgrub);
            expect(this.player1).toHavePromptButton('Rotgrub');
            expect(this.player1).toHavePromptButton('Rotgrub (play)');
            expect(this.player1).toHavePromptButton('Autoresolve');
        });

        it('should be able to use play as reap first', function () {
            this.player1.reap(this.rotgrub);
            this.player1.clickPrompt('Rotgrub (play)');
            expect(this.player2.amber).toBe(2);
            expect(this.rotgrub.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should be able to use native reap first', function () {
            this.player1.reap(this.rotgrub);
            this.player1.clickPrompt('Rotgrub');
            expect(this.player2.amber).toBe(3);
            expect(this.rotgrub.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should be able to opt out an optional play ability', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.reap(this.dinoBot);
            expect(this.player1).toHavePromptButton('Dino-Bot');
            expect(this.player1).toHavePromptButton('Dino-Bot (play)');
            expect(this.player1).not.toHavePromptButton('Autoresolve');
            this.player1.clickPrompt('Dino-Bot');
            this.player1.clickCard(this.dustImp);
            expect(this.player1.hand.length).toBe(6);
            expect(this.player1).toBeAbleToSelect(this.dinoBot);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });
    });

    describe('Two "on leaves play" abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['general-sherman', 'nature-s-call'],
                    inPlay: ['troll', 'brammo']
                },
                player2: {
                    amber: 3,
                    inPlay: ['umbra', 'lamindra'],
                    hand: ['magda-the-rat']
                }
            });

            this.game.manualMode = true;
            this.player1.play(this.generalSherman);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.magdaTheRat);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
        });

        it('should prompt for ability order', function () {
            this.player1.play(this.natureSCall);
            this.player1.clickCard(this.generalSherman);
            this.player1.clickCard(this.magdaTheRat);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt(
                'Any reactions to Magda the Rat leaving play or General Sherman leaving play?'
            );
            expect(this.player1).toHavePromptCardButton(this.generalSherman);
            expect(this.player1).toHavePromptCardButton(this.magdaTheRat);
            expect(this.player1).toHavePromptButton('Autoresolve');
            this.player1.clickPrompt('General Sherman');
        });
    });
});
