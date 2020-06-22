describe('Axiom of Grisk', function () {
    describe("Axiom of Grisk's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['axiom-of-grisk', 'troll', 'valdr', 'krump']
                },
                player2: {
                    hand: ['lamindra', 'groggins']
                }
            });
        });
        it('should not need to select any creature, but still gain 2 chains', function () {
            this.player1.play(this.axiomOfGrisk);

            expect(this.player1).not.toHavePrompt('Choose a creature to ward');
            expect(this.player1.chains).toBe(2);
        });
    });
});

describe("Axiom of Grisk's play ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                inPlay: ['troll', 'valdr', 'krump'],
                hand: ['axiom-of-grisk']
            },
            player2: {
                inPlay: ['lamindra', 'groggins']
            }
        });
    });

    it('should destroy all creatures without amber', function () {
        this.player1.play(this.axiomOfGrisk);

        expect(this.player1).toHavePrompt('Choose a creature to ward');

        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.valdr);
        expect(this.player1).toBeAbleToSelect(this.krump);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.groggins);

        this.player1.clickCard(this.krump);
        expect(this.player1.chains).toBe(2);

        expect(this.krump.location).toBe('play area');
        expect(this.krump.warded).toBe(false);
        expect(this.troll.location).toBe('discard');
        expect(this.lamindra.location).toBe('discard');
        expect(this.valdr.location).toBe('discard');
        expect(this.groggins.location).toBe('discard');
    });

    it('should destroy each creature without amber', function () {
        this.troll.tokens['amber'] = 1;
        this.lamindra.tokens['amber'] = 3;

        this.player1.play(this.axiomOfGrisk);

        expect(this.player1).toHavePrompt('Choose a creature to ward');

        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.valdr);
        expect(this.player1).toBeAbleToSelect(this.krump);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.groggins);

        this.player1.clickCard(this.krump);
        expect(this.player1.chains).toBe(2);

        expect(this.krump.location).toBe('play area');
        expect(this.krump.warded).toBe(false);
        expect(this.troll.location).toBe('play area');
        expect(this.lamindra.location).toBe('play area');

        expect(this.valdr.location).toBe('discard');
        expect(this.groggins.location).toBe('discard');
    });

    it('should destroy no creature without amber', function () {
        this.troll.tokens['amber'] = 1;
        this.valdr.tokens['amber'] = 3;
        this.krump.tokens['amber'] = 1;
        this.lamindra.tokens['amber'] = 3;
        this.groggins.tokens['amber'] = 3;

        this.player1.play(this.axiomOfGrisk);

        expect(this.player1).toHavePrompt('Choose a creature to ward');

        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.valdr);
        expect(this.player1).toBeAbleToSelect(this.krump);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.groggins);

        this.player1.clickCard(this.krump);
        expect(this.player1.chains).toBe(2);

        expect(this.troll.location).toBe('play area');
        expect(this.valdr.location).toBe('play area');
        expect(this.krump.location).toBe('play area');
        expect(this.lamindra.location).toBe('play area');
        expect(this.groggins.location).toBe('play area');
    });
});
