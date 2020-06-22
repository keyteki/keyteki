describe('Mug', function () {
    describe("Mug's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['mug', 'flaxia', 'troll']
                },
                player2: {
                    hand: ['lamindra', 'krump']
                }
            });
        });

        it('should not prompt for any creature', function () {
            this.player1.play(this.mug);
            expect(this.player1).not.toHavePrompt('Choose a captured amber to move to your pool.');
            expect(this.player1.amber).toBe(1);
        });
    });
});

describe("Mug's play ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                amber: 1,
                inPlay: ['flaxia', 'troll'],
                hand: ['mug']
            },
            player2: {
                amber: 4,
                inPlay: ['lamindra', 'krump']
            }
        });

        this.flaxia.tokens['amber'] = 2;
        this.krump.tokens['amber'] = 1;
    });

    it('should move 1 amber and deal 2 damages to friendly creature', function () {
        this.player1.play(this.mug);

        expect(this.player1).toHavePrompt('Choose a captured amber to move to your pool.');
        expect(this.player1).toBeAbleToSelect(this.flaxia);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.krump);

        this.player1.clickCard(this.flaxia);

        expect(this.flaxia.tokens.amber).toBe(1);
        expect(this.flaxia.tokens.damage).toBe(2);

        expect(this.krump.tokens.amber).toBe(1);

        expect(this.player1.amber).toBe(3);
        expect(this.player2.amber).toBe(4);
    });

    it('should move 1 amber and deal 2 damages to enemy creature', function () {
        this.player1.play(this.mug);

        expect(this.player1).toBeAbleToSelect(this.flaxia);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.krump);

        this.player1.clickCard(this.krump);

        expect(this.krump.hasToken('amber')).toBe(false);
        expect(this.krump.tokens.damage).toBe(2);

        expect(this.flaxia.tokens.amber).toBe(2);

        expect(this.player1.amber).toBe(3);
        expect(this.player2.amber).toBe(4);
    });

    it('should deal 2 damages to creature without amber', function () {
        this.player1.play(this.mug);

        expect(this.player1).toHavePrompt('Choose a captured amber to move to your pool.');
        expect(this.player1).toBeAbleToSelect(this.flaxia);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.krump);

        this.player1.clickCard(this.troll);

        expect(this.troll.hasToken('amber')).toBe(false);
        expect(this.troll.tokens.damage).toBe(2);

        expect(this.krump.tokens.amber).toBe(1);
        expect(this.flaxia.tokens.amber).toBe(2);

        expect(this.player1.amber).toBe(2);
        expect(this.player2.amber).toBe(4);
    });
});
