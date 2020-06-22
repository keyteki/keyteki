describe('Tertiate', function () {
    describe("Tertiate's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['tertiate', 'brutodon-auxiliary']
                },
                player2: {
                    hand: [
                        'lamindra',
                        'redlock',
                        'gub',
                        'shooler',
                        'dextre',
                        'archimedes',
                        'helper-bot',
                        'spyyyder',
                        'skullion'
                    ]
                }
            });
        });

        it('should only gain the card amber', function () {
            this.player1.play(this.tertiate);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });
    });

    describe("Tertiate's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['skullion'],
                    hand: ['tertiate']
                },
                player2: {
                    hand: [
                        'lamindra',
                        'redlock',
                        'gub',
                        'shooler',
                        'dextre',
                        'archimedes',
                        'helper-bot',
                        'spyyyder',
                        'skullion'
                    ]
                }
            });
        });

        it('should destroy 1 friendly creature', function () {
            this.player1.play(this.tertiate);

            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.skullion);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.skullion.location).toBe('discard');
        });
    });

    describe("Tertiate's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['tertiate']
                },
                player2: {
                    inPlay: ['lamindra', 'redlock', 'gub', 'shooler', 'dextre']
                }
            });
        });

        it('should destroy 2 enemy creatures', function () {
            this.player1.play(this.tertiate);

            expect(this.player1).toHavePrompt('Choose 2 creatures');
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.redlock.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
        });
    });

    describe("Tertiate's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['brutodon-auxiliary', 'krump', 'troll', 'groggins'],
                    hand: ['tertiate']
                },
                player2: {
                    inPlay: [
                        'lamindra',
                        'redlock',
                        'gub',
                        'shooler',
                        'dextre',
                        'archimedes',
                        'helper-bot',
                        'spyyyder',
                        'skullion'
                    ]
                }
            });
        });

        it('should destroy 2 friendly and 3 enemy creatures', function () {
            this.player1.play(this.tertiate);

            expect(this.player1).toHavePrompt('Choose 3 creatures');

            expect(this.player1).not.toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);

            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.spyyyder);
            expect(this.player1).toBeAbleToSelect(this.skullion);

            this.player1.clickCard(this.skullion);
            this.player1.clickCard(this.spyyyder);
            this.player1.clickCard(this.lamindra);

            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);

            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);

            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.troll);

            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');

            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.skullion.location).toBe('discard');
            expect(this.spyyyder.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
        });
    });
});
