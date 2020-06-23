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
            expect(this.player1).not.toHavePromptButton('Ward a creature');
            expect(this.player1).not.toHavePromptButton('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.tokens.ward).toBe(1);
        });

        it('should allow warding an enemy creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.ward).toBe(1);
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

            this.lamindra.tokens.ward = 1;
        });

        it('should allow warding a warded creature', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).not.toHavePromptButton('Ward a creature');
            expect(this.player1).not.toHavePromptButton('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.tokens.ward).toBe(1);
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
            this.lamindra.tokens.ward = 1;
            this.troll.tokens.ward = 2;
        });

        it('should have option to ward', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Ward a creature');
            this.player1.clickCard(this.redlock);
            expect(this.redlock.tokens.ward).toBe(1);
        });

        it('should allow moving a token', function () {
            this.player1.play(this.hunterOrHunted);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toHavePromptButton('Ward a creature');
            expect(this.player1).toHavePromptButton('Move a ward');
            this.player1.clickPrompt('Move a ward');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Hunter or Hunted?');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.troll.tokens.ward).toBe(1);
            expect(this.krump.tokens.ward).toBe(1);
        });
    });
});
