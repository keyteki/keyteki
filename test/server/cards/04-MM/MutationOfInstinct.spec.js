describe('Mutation of Instinct', function () {
    describe('Mutation of Instinct', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['mutation-of-instinct']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'umbra']
                }
            });
        });

        it('should give a creature mutant trait', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfInstinct);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
        });

        it('should give a creature skirmish keyword', function () {
            this.player1.play(this.mutationOfInstinct);
            this.player1.clickCard(this.flaxia);
            this.player1.fightWith(this.flaxia, this.troll);
            expect(this.flaxia.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.flaxia.damage).toBe(0);
            expect(this.troll.damage).toBe(4);
        });

        it('should last until start of next turn', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfInstinct);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            expect(this.flaxia.getKeywordValue('skirmish')).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            expect(this.flaxia.getKeywordValue('skirmish')).toBe(0);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'untamed',
                    hand: ['mutation-of-instinct'],
                    inPlay: ['tachyon-manifold', 'flaxia']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: []
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'untamed');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect player's next turn", function () {
            this.player1.play(this.mutationOfInstinct);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            this.player1.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
