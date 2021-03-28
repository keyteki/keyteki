describe('Unnatural Selection', function () {
    describe("Unnatural Selection's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia', 'knoxx', 'lamindra'],
                    hand: ['flaxia', 'unnatural-selection']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not need to select anything', function () {
            this.player1.play(this.unnaturalSelection);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1.amber).toBe(1);
        });
    });

    describe("Unnatural Selection's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia', 'knoxx', 'lamindra', 'redlock'],
                    hand: ['unnatural-selection']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should select 3 friendly creatures', function () {
            this.player1.play(this.unnaturalSelection);

            expect(this.player1).toHavePrompt('Choose 3 friendly creatures');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Done');

            this.player1.clickCard(this.knoxx);
            expect(this.player1).not.toHavePromptButton('Done');

            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.lamindra.location).toBe('play area');
            expect(this.knoxx.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');

            expect(this.player1).toHavePrompt('Choose 3 enemy creatures');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.flaxia.location).toBe('play area');
            expect(this.knoxx.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.redlock.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
        });
    });

    describe("Unnatural Selection's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll'],
                    hand: ['unnatural-selection']
                },
                player2: {
                    inPlay: ['flaxia', 'knoxx', 'lamindra', 'redlock']
                }
            });
        });

        it('should select 3 enemy creatures', function () {
            this.player1.play(this.unnaturalSelection);

            expect(this.player1).toHavePrompt('Choose 3 friendly creatures');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.troll.location).toBe('play area');

            expect(this.player1).toHavePrompt('Choose 3 enemy creatures');

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Done');

            this.player1.clickCard(this.knoxx);
            expect(this.player1).not.toHavePromptButton('Done');

            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.flaxia.location).toBe('play area');
            expect(this.knoxx.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.redlock.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
        });
    });

    describe("Unnatural Selection's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'krump', 'charette', 'gub', 'shooler'],
                    hand: ['unnatural-selection']
                },
                player2: {
                    inPlay: ['flaxia', 'knoxx', 'lamindra', 'redlock', 'dew-faerie']
                }
            });
        });

        it('should select 3 friendly and 3 enemy creatures', function () {
            this.player1.play(this.unnaturalSelection);

            expect(this.player1).toHavePrompt('Choose 3 friendly creatures');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);

            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.krump);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.charette);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.charette.location).toBe('play area');

            expect(this.player1).toHavePrompt('Choose 3 enemy creatures');

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.knoxx);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.flaxia.location).toBe('play area');
            expect(this.knoxx.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.redlock.location).toBe('discard');
            expect(this.dewFaerie.location).toBe('discard');

            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.shooler.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
        });
    });
});
