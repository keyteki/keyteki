describe('Mutation of Fury', function () {
    describe('Mutation of Fury', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['mutation-of-fury']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'umbra']
                }
            });
        });

        it('should give a creature mutant trait', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfFury);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
        });

        it('should give a creature assault 3 keyword', function () {
            this.player1.play(this.mutationOfFury);
            this.player1.clickCard(this.flaxia);
            this.player1.fightWith(this.flaxia, this.troll);
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(7);
        });

        it('should last until start of next turn', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfFury);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            expect(this.flaxia.getKeywordValue('assault')).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            expect(this.flaxia.getKeywordValue('assault')).toBe(0);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'untamed',
                    hand: ['mutation-of-fury'],
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
            this.player1.play(this.mutationOfFury);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            this.player1.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
