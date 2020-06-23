describe('Library of Polliasaurus', function () {
    describe("Library of Polliasaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['library-of-polliasaurus'],
                    hand: ['questor-jarta']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should not prompt for any creature, since there is no friendly creature.', function () {
            this.player1.useAction(this.libraryOfPolliasaurus);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should not prompt for any creature, since friendly creature has no.', function () {
            this.player1.playCreature(this.questorJarta);
            this.player1.useAction(this.libraryOfPolliasaurus);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });
    });
});

describe("Library of Polliasaurus's ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                amber: 1,
                inPlay: ['questor-jarta', 'lamindra', 'library-of-polliasaurus'],
                hand: []
            },
            player2: {
                amber: 4,
                inPlay: ['shooler', 'gub']
            }
        });

        this.questorJarta.tokens.amber = 2;
        this.shooler.tokens.amber = 2;
    });

    it('should allow picking from friendly creature', function () {
        this.player1.useAction(this.libraryOfPolliasaurus);

        expect(this.player1).toHavePrompt('Choose a creature');
        expect(this.player1).toBeAbleToSelect(this.questorJarta);
        expect(this.player1).not.toBeAbleToSelect(this.lamindra);
        expect(this.player1).not.toBeAbleToSelect(this.gub);
        expect(this.player1).not.toBeAbleToSelect(this.shooler);

        this.player1.clickCard(this.questorJarta);

        expect(this.questorJarta.tokens.amber).toBe(1);
        expect(this.player1.amber).toBe(2);
    });
});
