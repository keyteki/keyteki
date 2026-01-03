describe("altruistSRostrum's play ability", function () {
    describe('play ability with one creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['archimedes', 'altruist-s-rostrum']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should not prompt for any creature, since no other creature to place amber', function () {
            this.archimedes.tokens.amber = 9;
            this.player1.useAction(this.altruistSRostrum);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe('Altruists Rostrum action with multiple creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['archimedes', 'dextre', 'altruist-s-rostrum']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'shooler']
                }
            });

            this.archimedes.tokens.amber = 9;
            this.shooler.tokens.amber = 1;
            this.player1.useAction(this.altruistSRostrum);
        });

        it('should allow picking from friendly and placing on friendly creature', function () {
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            this.player1.clickCard(this.archimedes);

            expect(this.player1).toHavePrompt('Choose another creature');

            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.dextre);

            expect(this.archimedes.tokens.amber).toBe(8);
            expect(this.dextre.tokens.amber).toBe(1);
        });

        it('should allow picking from friendly and placing on enemy creature', function () {
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.archimedes);

            expect(this.player1).toHavePrompt('Choose another creature');

            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.shooler);

            expect(this.archimedes.tokens.amber).toBe(8);
            expect(this.shooler.tokens.amber).toBe(2);
        });

        it('should allow picking from enemy and placing on friendly creature', function () {
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.shooler);

            expect(this.player1).toHavePrompt('Choose another creature');

            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.archimedes);

            this.player1.clickCard(this.archimedes);

            expect(this.archimedes.tokens.amber).toBe(10);
            expect(this.shooler.hasToken('amber')).toBe(false);
        });

        it('should allow picking from enemy and placing on enemy creature', function () {
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.shooler);

            expect(this.player1).toHavePrompt('Choose another creature');

            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.archimedes);

            this.player1.clickCard(this.gub);

            expect(this.gub.tokens.amber).toBe(1);
            expect(this.shooler.hasToken('amber')).toBe(false);
        });

        it('should allow picking a creature without amber', function () {
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            this.player1.clickCard(this.dextre);

            this.expectReadyToTakeAction(this.player1);

            expect(this.dextre.tokens.amber).toBeUndefined();
        });
    });
});
