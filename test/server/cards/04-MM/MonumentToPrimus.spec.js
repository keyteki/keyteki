describe('Monument to Primus', function () {
    describe("Monument to Primus's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['monument-to-primus'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should not prompt for any creature, since no other creature to place amber', function () {
            this.player1.useAction(this.monumentToPrimus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});

describe("Monument to Primus's action ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                amber: 1,
                inPlay: ['archimedes', 'dextre', 'consul-primus', 'monument-to-primus'],
                hand: ['chant-of-hubris']
            },
            player2: {
                amber: 4,
                inPlay: ['gub', 'shooler']
            }
        });

        this.archimedes.tokens.amber = 9;
        this.shooler.tokens.amber = 1;
    });

    it('should allow picking from friendly and placing on friendly creature only, when CP is not in discard', function () {
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).not.toBeAbleToSelect(this.gub);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.archimedes);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).not.toBeAbleToSelect(this.archimedes);
        expect(this.player1).not.toBeAbleToSelect(this.gub);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.dextre);

        expect(this.archimedes.tokens.amber).toBe(8);
        expect(this.dextre.tokens.amber).toBe(1);
    });

    it('should allow picking from friendly and placing on friendly creature only, when CP is in discard', function () {
        this.player1.moveCard(this.consulPrimus, 'discard');
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.shooler);

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

    it('should allow picking from friendly and placing on enemy creature, when CP is in discard', function () {
        this.player1.moveCard(this.consulPrimus, 'discard');
        this.player1.useAction(this.monumentToPrimus);

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

    it('should allow picking from enemy and placing on friendly creature, when CP is in discard', function () {
        this.player1.moveCard(this.consulPrimus, 'discard');
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.shooler);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.archimedes);

        expect(this.archimedes.tokens.amber).toBe(10);
        expect(this.shooler.hasToken('amber')).toBe(false);
    });

    it('should allow picking from enemy and placing on enemy creature, when CP is in discard', function () {
        this.player1.moveCard(this.consulPrimus, 'discard');
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.shooler);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.gub);

        expect(this.gub.tokens.amber).toBe(1);
        expect(this.shooler.hasToken('amber')).toBe(false);
    });

    it('should allow picking a creature without amber, when CP is not in discard', function () {
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);
        expect(this.player1).not.toBeAbleToSelect(this.gub);

        this.player1.clickCard(this.dextre);

        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

        expect(this.dextre.tokens.amber).toBeUndefined();
    });

    it('should allow picking a creature without amber, when CP is in discard', function () {
        this.player1.moveCard(this.consulPrimus, 'discard');
        this.player1.useAction(this.monumentToPrimus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.shooler);
        expect(this.player1).toBeAbleToSelect(this.gub);

        this.player1.clickCard(this.gub);

        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

        expect(this.gub.tokens.amber).toBeUndefined();
    });
});
