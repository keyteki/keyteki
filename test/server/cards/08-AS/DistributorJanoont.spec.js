describe('Distributor Janŏŏnt', function () {
    describe("Distributor Janŏŏnt's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    inPlay: ['distributor-janŏŏnt'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should not prompt for any creature, since no other creature to place amber', function () {
            this.distributorJanŏŏnt.tokens.amber = 9;
            this.player1.reap(this.distributorJanŏŏnt);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});

describe("Distributor Janŏŏnt's fight/reap ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'ekwidon',
                amber: 1,
                inPlay: ['archimedes', 'dextre', 'distributor-janŏŏnt'],
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

    it('should allow picking from friendly and placing on friendly creature', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.archimedes);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.shooler);
        expect(this.player1).toBeAbleToSelect(this.distributorJanŏŏnt);

        this.player1.clickCard(this.dextre);

        expect(this.archimedes.tokens.amber).toBe(8);
        expect(this.dextre.tokens.amber).toBe(1);
    });

    it('should allow picking from friendly and placing on enemy creature', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.archimedes);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.shooler);
        expect(this.player1).toBeAbleToSelect(this.distributorJanŏŏnt);

        this.player1.clickCard(this.shooler);

        expect(this.archimedes.tokens.amber).toBe(8);
        expect(this.shooler.tokens.amber).toBe(2);
    });

    it('should allow picking from enemy and placing on friendly creature', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.shooler);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.distributorJanŏŏnt);

        this.player1.clickCard(this.archimedes);

        expect(this.archimedes.tokens.amber).toBe(10);
        expect(this.shooler.hasToken('amber')).toBe(false);
    });

    it('should allow picking from enemy and placing on itself', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.shooler);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.distributorJanŏŏnt);

        this.player1.clickCard(this.distributorJanŏŏnt);

        expect(this.distributorJanŏŏnt.tokens.amber).toBe(1);
        expect(this.shooler.hasToken('amber')).toBe(false);
    });

    it('should allow picking from enemy and placing on enemy creature', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.shooler);

        expect(this.player1).toHavePrompt('Choose another creature');

        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.gub);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.distributorJanŏŏnt);

        this.player1.clickCard(this.gub);

        expect(this.gub.tokens.amber).toBe(1);
        expect(this.shooler.hasToken('amber')).toBe(false);
    });

    it('should allow picking a creature without amber', function () {
        this.player1.reap(this.distributorJanŏŏnt);
        expect(this.player1.amber).toBe(2);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        expect(this.player1).toBeAbleToSelect(this.dextre);
        expect(this.player1).toBeAbleToSelect(this.shooler);
        expect(this.player1).toBeAbleToSelect(this.gub);

        this.player1.clickCard(this.dextre);

        expect(this.player1).isReadyToTakeAction();

        expect(this.dextre.tokens.amber).toBeUndefined();
    });

    it('should work on a fight', function () {
        this.player1.fightWith(this.distributorJanŏŏnt, this.gub);
        this.player1.clickCard(this.archimedes);
        this.player1.clickCard(this.shooler);
        expect(this.archimedes.tokens.amber).toBe(8);
        expect(this.shooler.tokens.amber).toBe(2);
    });
});
