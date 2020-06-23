describe('Khrkhar’s Blaster', function () {
    describe("Khrkhar’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['khrkhar-s-blaster'],
                    inPlay: ['lieutenant-khrkhar', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should ward the associated officer', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.lieutenantKhrkhar);
            expect(this.lieutenantKhrkhar.warded).toBe(true);
            expect(this.techivorePulpate.warded).toBe(false);
        });

        it('should not ward the non associated officer', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            expect(this.lieutenantKhrkhar.warded).toBe(false);
            expect(this.techivorePulpate.warded).toBe(false);
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Khrkhar’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Khrkhar’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Khrkhar’s Blaster');
            this.player1.clickPrompt('Move Khrkhar’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.lieutenantKhrkhar);
            expect(this.lieutenantKhrkhar.warded).toBe(true);
            expect(this.lieutenantKhrkhar.upgrades).toContain(this.khrkharSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.khrkharSBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Khrkhar’s Blaster');
            this.player1.clickPrompt('Move Khrkhar’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.lieutenantKhrkhar);
            expect(this.lieutenantKhrkhar.warded).toBe(true);
            expect(this.lieutenantKhrkhar.upgrades).toContain(this.khrkharSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.khrkharSBlaster);
        });
    });

    describe("Khrkhar’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['khrkhar-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.khrkharSBlaster, this.techivorePulpate);
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

    describe("Khrkhar’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['khrkhar-s-blaster', 'lieutenant-khrkhar'],
                    inPlay: ['lieutenant-khrkhar', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.lieutenantKhrkhar1 = this.player1.findCardByName(
                'lieutenant-khrkhar',
                'play area'
            );
            this.lieutenantKhrkhar2 = this.player1.findCardByName('lieutenant-khrkhar', 'hand');
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.player1.playUpgrade(this.khrkharSBlaster, this.lieutenantKhrkhar1);
            this.player1.playCreature(this.lieutenantKhrkhar2);
            this.player1.reap(this.lieutenantKhrkhar1);
            this.player1.clickCard(this.lieutenantKhrkhar1);

            this.player1.clickPrompt('Move Khrkhar’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar1);
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar2);
            this.player1.clickCard(this.lieutenantKhrkhar2);

            expect(this.lieutenantKhrkhar1.upgrades).not.toContain(this.khrkharSBlaster);
            expect(this.lieutenantKhrkhar2.upgrades).toContain(this.khrkharSBlaster);

            expect(this.lieutenantKhrkhar1.warded).toBe(true);
            expect(this.lieutenantKhrkhar2.warded).toBe(true);
        });
    });
});
