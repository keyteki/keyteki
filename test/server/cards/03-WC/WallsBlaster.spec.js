describe('Walls’ Blaster', function () {
    describe("Walls’ Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['walls--blaster', 'explo-rover', 'force-field'],
                    inPlay: ['chief-engineer-walls', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.techivorePulpate.tokens.damage = 2;
        });

        it('should allow stunning creatures when attached to the associated officer', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.chiefEngineerWalls);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should allow stunning 3 creatures when attached to the associated officer', function () {
            this.player1.playUpgrade(this.forceField, this.chiefEngineerWalls);
            this.player1.playUpgrade(this.exploRover, this.chiefEngineerWalls);
            this.player1.playUpgrade(this.wallsBlaster, this.chiefEngineerWalls);
            expect(this.player1).toHavePrompt('Choose 3 creatures');
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.techivorePulpate);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.krump.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
            expect(this.techivorePulpate.stunned).toBe(true);
        });

        it('should not prompt for stunning when attached to the non associated officer', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            this.player1.clickPrompt('Move Walls’ Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.stunned).toBe(true);
            expect(this.chiefEngineerWalls.upgrades).toContain(this.wallsBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.wallsBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            this.player1.clickPrompt('Move Walls’ Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.stunned).toBe(true);
            expect(this.chiefEngineerWalls.upgrades).toContain(this.wallsBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.wallsBlaster);
        });
    });

    describe("Walls’ Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['walls--blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);
            this.player1.clickCard(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });
    });

    describe("Walls’ Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['walls--blaster'],
                    inPlay: ['techivore-pulpate', 'chief-engineer-walls', 'chief-engineer-walls']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.techivorePulpate.tokens.damage = 2;
            this.chiefEngineerWalls1 = this.player1.player.creaturesInPlay[1];
            this.chiefEngineerWalls2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.wallsBlaster, this.chiefEngineerWalls1);
            this.player1.clickCard(this.techivorePulpate);
            this.player1.reap(this.chiefEngineerWalls1);
            this.player1.clickCard(this.chiefEngineerWalls1);

            this.player1.clickPrompt('Move Walls’ Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.chiefEngineerWalls1);
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls2);
            this.player1.clickCard(this.chiefEngineerWalls2);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.stunned).toBe(true);

            expect(this.chiefEngineerWalls1.upgrades).not.toContain(this.wallsBlaster);
            expect(this.chiefEngineerWalls2.upgrades).toContain(this.wallsBlaster);
        });
    });
});
