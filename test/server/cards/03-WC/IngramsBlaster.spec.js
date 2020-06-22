describe('Ingram’s Blaster', function () {
    describe("Ingram’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['ingram-s-blaster'],
                    inPlay: ['medic-ingram', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.techivorePulpate.tokens.damage = 2;
        });

        it('should allow fully healing a creature when attached to the associated officer', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.medicIngram);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.hasToken('damage')).toBe(false);
        });

        it('should allow fully healing an enemy creature when attached to the associated officer', function () {
            this.krump.tokens.damage = 1;
            this.player1.playUpgrade(this.ingramSBlaster, this.medicIngram);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.hasToken('damage')).toBe(false);
        });

        it('should not prompt for healing when attached to the non associated officer', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Ingram’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Ingram’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Ingram’s Blaster');
            this.player1.clickPrompt('Move Ingram’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.medicIngram);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.hasToken('damage')).toBe(false);
            expect(this.medicIngram.upgrades).toContain(this.ingramSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.ingramSBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Ingram’s Blaster');
            this.player1.clickPrompt('Move Ingram’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.medicIngram);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.hasToken('damage')).toBe(false);
            expect(this.medicIngram.upgrades).toContain(this.ingramSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.ingramSBlaster);
        });
    });

    describe("Ingram’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['ingram-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.ingramSBlaster, this.techivorePulpate);
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

    describe("Ingram’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['ingram-s-blaster'],
                    inPlay: ['techivore-pulpate', 'medic-ingram', 'medic-ingram']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.techivorePulpate.tokens.damage = 2;
            this.medicIngram1 = this.player1.player.creaturesInPlay[1];
            this.medicIngram2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.ingramSBlaster, this.medicIngram1);
            this.player1.clickCard(this.techivorePulpate);
            this.player1.reap(this.medicIngram1);
            this.player1.clickCard(this.medicIngram1);

            this.player1.clickPrompt('Ingram’s Blaster');
            this.player1.clickPrompt('Move Ingram’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram1);
            expect(this.player1).toBeAbleToSelect(this.medicIngram2);
            this.player1.clickCard(this.medicIngram2);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.hasToken('damage')).toBe(false);

            expect(this.medicIngram1.upgrades).not.toContain(this.ingramSBlaster);
            expect(this.medicIngram2.upgrades).toContain(this.ingramSBlaster);
        });
    });
});
