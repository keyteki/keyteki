describe('Frane’s Blaster', function () {
    describe("Frane’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['frane-s-blaster'],
                    inPlay: ['first-officer-frane', 'techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('should return all amber from the associated officer', function () {
            this.firstOfficerFrane.tokens.amber = 3;
            this.player1.playUpgrade(this.franeSBlaster, this.firstOfficerFrane);
            expect(this.firstOfficerFrane.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(4);
        });

        it('should not return all amber from the non associated officer', function () {
            this.techivorePulpate.tokens.amber = 3;
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            expect(this.techivorePulpate.tokens.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
        });

        it('reap ability should allow choosing for an action and cancel', function () {
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('reap ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Frane’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('fight ability should allow dealing 2 damages to a creature', function () {
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Frane’s Blaster');
            this.player1.clickPrompt('Deal 2 damage');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
        });

        it('reap ability should allow moving the upgrade to the appropriate officer', function () {
            this.firstOfficerFrane.tokens.amber = 3;

            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            this.player1.reap(this.techivorePulpate);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Frane’s Blaster');
            this.player1.clickPrompt('Move Frane’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.firstOfficerFrane);
            expect(this.firstOfficerFrane.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(5);
            expect(this.firstOfficerFrane.upgrades).toContain(this.franeSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.franeSBlaster);
        });

        it('fight ability should allow moving the upgrade to the appropriate officer', function () {
            this.firstOfficerFrane.tokens.amber = 3;

            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
            this.player1.fightWith(this.techivorePulpate, this.lamindra);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.techivorePulpate);
            this.player1.clickCard(this.techivorePulpate);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Frane’s Blaster');
            this.player1.clickPrompt('Move Frane’s Blaster');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).not.toBeAbleToSelect(this.techivorePulpate);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.firstOfficerFrane);
            expect(this.firstOfficerFrane.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(4);
            expect(this.firstOfficerFrane.upgrades).toContain(this.franeSBlaster);
            expect(this.techivorePulpate.upgrades).not.toContain(this.franeSBlaster);
        });
    });

    describe("Frane’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['frane-s-blaster'],
                    inPlay: ['techivore-pulpate']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });
        });

        it('reap ability should default to deal damage when officer is not in play', function () {
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
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
            this.player1.playUpgrade(this.franeSBlaster, this.techivorePulpate);
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

    describe("Frane’s Blaster's attach ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['frane-s-blaster'],
                    inPlay: ['techivore-pulpate', 'first-officer-frane', 'first-officer-frane']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.firstOfficerFrane1 = this.player1.player.creaturesInPlay[1];
            this.firstOfficerFrane2 = this.player1.player.creaturesInPlay[2];
        });

        it('should allow moving upgrade between officers of same name', function () {
            this.firstOfficerFrane1.tokens.amber = 3;
            this.firstOfficerFrane2.tokens.amber = 5;

            this.player1.playUpgrade(this.franeSBlaster, this.firstOfficerFrane1);
            this.player1.reap(this.firstOfficerFrane1);
            this.player1.clickCard(this.firstOfficerFrane1);

            this.player1.clickPrompt('Frane’s Blaster');
            this.player1.clickPrompt('Move Frane’s Blaster');
            expect(this.player1).not.toBeAbleToSelect(this.firstOfficerFrane1);
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane2);
            this.player1.clickCard(this.firstOfficerFrane2);

            expect(this.firstOfficerFrane1.upgrades).not.toContain(this.franeSBlaster);
            expect(this.firstOfficerFrane2.upgrades).toContain(this.franeSBlaster);

            expect(this.firstOfficerFrane1.hasToken('amber')).toBe(false);
            expect(this.firstOfficerFrane2.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(10);
        });
    });
});
