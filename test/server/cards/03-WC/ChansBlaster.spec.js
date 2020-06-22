describe('Chan’s Blaster', function () {
    describe("Chan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['chan-s-blaster'],
                    inPlay: ['commander-chan', 'techivore-pulpate', 'gub']
                },
                player2: {
                    amber: 2,
                    hand: ['troll'],
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should allow using another friendly creature and cancel when attached to the associated officer', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.commanderChan);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
        });

        it('should allow using another friendly creature when attached to the associated officer', function () {
            this.player1.reap(this.techivorePulpate);
            this.player1.playUpgrade(this.chanSBlaster, this.commanderChan);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.commanderChan);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
        });

        it('should not prompt for using another creature when attached to the non associated officer', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Chan’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.commanderChan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Chan’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.commanderChan);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Chan’s Blaster');
            this.player1.clickPrompt('Move Chan’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.commanderChan);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.commanderChan);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Chan’s Blaster');
            this.player1.clickPrompt('Move Chan’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.commanderChan);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.commanderChan);
            this.player1.clickPrompt('Done');
        });
    });

    describe("Chan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['chan-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.chanSBlaster, this.techivorePulpate);
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

    describe("Chan’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['chan-s-blaster'],
                    inPlay: [
                        'techivore-pulpate',
                        'commander-chan',
                        'commander-chan',
                        'gub',
                        'shooler'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.commanderChan1 = this.player1.player.creaturesInPlay[1];
            this.commanderChan2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.commanderChan1);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Reap with this creature');
            this.player1.reap(this.commanderChan1);
            this.player1.clickCard(this.commanderChan1);

            this.player1.clickPrompt('Chan’s Blaster');
            this.player1.clickPrompt('Move Chan’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.commanderChan1);
            expect(this.player1).toBeAbleToSelect(this.commanderChan2);
            this.player1.clickCard(this.commanderChan2);
            this.player1.clickCard(this.shooler);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(4);

            expect(this.commanderChan1.upgrades).not.toContain(this.chanSBlaster);
            expect(this.commanderChan2.upgrades).toContain(this.chanSBlaster);
        });
    });
});
