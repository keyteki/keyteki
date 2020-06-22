describe('Qincan’s Blaster', function () {
    describe("Qincan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['qincan-s-blaster'],
                    inPlay: ['sci-officer-qincan', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    hand: ['troll'],
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should allow archiving and cancel when attached to the associated officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.sciOfficerQincan);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
        });

        it('should allow archiving a friendly creature when attached to the associated officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.sciOfficerQincan);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.techivorePulpate);
        });

        it('should allow archiving an enemy creature when attached to the associated officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.sciOfficerQincan);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.krump);
        });

        it('should not prompt for dealing damage when attached to the non associated officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Qincan’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Qincan’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Qincan’s Blaster');
            this.player1.clickPrompt('Move Qincan’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.sciOfficerQincan);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.location).toBe('archives');
            expect(this.sciOfficerQincan.upgrades).toContain(this.qincanSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.qincanSBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Qincan’s Blaster');
            this.player1.clickPrompt('Move Qincan’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.sciOfficerQincan);
            this.player1.clickPrompt('Done');
            expect(this.sciOfficerQincan.upgrades).toContain(this.qincanSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.qincanSBlaster);
        });
    });

    describe("Qincan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['qincan-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.qincanSBlaster, this.techivorePulpate);
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

    describe("Qincan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['qincan-s-blaster'],
                    inPlay: ['techivore-pulpate', 'sci-officer-qincan', 'sci-officer-qincan', 'gub']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.sciOfficerQincan1 = this.player1.player.creaturesInPlay[1];
            this.sciOfficerQincan2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.qincanSBlaster, this.sciOfficerQincan1);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.techivorePulpate.location).toBe('archives');
            this.player1.reap(this.sciOfficerQincan1);
            this.player1.clickCard(this.sciOfficerQincan1);

            this.player1.clickPrompt('Move Qincan’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.sciOfficerQincan1);
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan2);
            this.player1.clickCard(this.sciOfficerQincan2);
            this.player1.clickCard(this.gub);
            expect(this.gub.location).toBe('archives');

            expect(this.sciOfficerQincan1.upgrades).not.toContain(this.qincanSBlaster);
            expect(this.sciOfficerQincan2.upgrades).toContain(this.qincanSBlaster);
        });
    });
});
