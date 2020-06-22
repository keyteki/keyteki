describe('Molina’s Blaster', function () {
    describe("Molina’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['molina-s-blaster'],
                    inPlay: ['armsmaster-molina', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    hand: ['troll'],
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should allow dealing 3 damages and cancel when attached to the associated officer', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.armsmasterMolina);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
        });

        it('should allow dealing 3 damages to a creature when attached to the associated officer', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.armsmasterMolina);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
        });

        it('should not prompt for dealing damage when attached to the non associated officer', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Molina’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Molina’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Molina’s Blaster');
            this.player1.clickPrompt('Move Molina’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.armsmasterMolina);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.techivorePulpate.upgrades).not.toContain(this.molinaSBlaster);
            expect(this.armsmasterMolina.upgrades).toContain(this.molinaSBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Molina’s Blaster');
            this.player1.clickPrompt('Move Molina’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.armsmasterMolina);
            this.player1.clickPrompt('Done');
            expect(this.techivorePulpate.upgrades).not.toContain(this.molinaSBlaster);
            expect(this.armsmasterMolina.upgrades).toContain(this.molinaSBlaster);
        });
    });

    describe("Molina’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['molina-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.molinaSBlaster, this.techivorePulpate);
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

    describe("Molina’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['molina-s-blaster'],
                    inPlay: ['techivore-pulpate', 'armsmaster-molina', 'armsmaster-molina']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.armsmasterMolina1 = this.player1.player.creaturesInPlay[1];
            this.armsmasterMolina2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.molinaSBlaster, this.armsmasterMolina1);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            this.player1.reap(this.armsmasterMolina1);
            this.player1.clickCard(this.armsmasterMolina1);

            this.player1.clickPrompt('Move Molina’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.armsmasterMolina1);
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina2);
            this.player1.clickCard(this.armsmasterMolina2);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');

            expect(this.armsmasterMolina1.upgrades).not.toContain(this.molinaSBlaster);
            expect(this.armsmasterMolina2.upgrades).toContain(this.molinaSBlaster);
        });
    });
});
