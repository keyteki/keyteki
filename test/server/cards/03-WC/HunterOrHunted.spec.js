describe('Hunter or Hunted?', function () {
    describe("Hunter or Hunted?'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hunter-or-hunted'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow warding a friendly creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Ward a creature');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.warded).toBe(true);
        });

        it('should allow warding an enemy creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Ward a creature');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting move a ward with no wards out', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting move a ward with only one creature in play', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.troll.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hunter or Hunted?'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hunter-or-hunted'],
                    inPlay: ['lamindra']
                },
                player2: {
                    hand: ['troll', 'krump']
                }
            });

            this.lamindra.ward();
        });

        it('should allow warding a warded creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Ward a creature');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.warded).toBe(true);
            expect(this.lamindra.tokens.ward).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hunter or Hunted?'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hunter-or-hunted'],
                    inPlay: ['lamindra', 'redlock']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
            this.lamindra.ward();
            this.troll.ward();
        });

        it('should have option to ward', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Ward a creature');
            this.player1.clickCard(this.redlock);
            expect(this.redlock.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow moving a token from a warded creature to a non-warded creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.troll.warded).toBe(false);
            expect(this.krump.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow moving a token from a warded creature to a warded creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.troll.warded).toBe(false);
            expect(this.lamindra.warded).toBe(true);
            expect(this.lamindra.tokens.ward).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow moving a token from a non-warded creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.redlock);
            expect(this.player1).isReadyToTakeAction();
            expect(this.redlock.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
