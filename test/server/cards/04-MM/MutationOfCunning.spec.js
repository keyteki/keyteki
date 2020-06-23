describe('Mutation of Cunning', function () {
    describe('Mutation of Cunning', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['mutation-of-cunning']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'umbra']
                }
            });
        });

        it('should give a creature mutant trait', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfCunning);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
        });

        it('should give a creature elusive keyword', function () {
            this.player1.play(this.mutationOfCunning);
            this.player1.clickCard(this.troll);
            this.player1.fightWith(this.flaxia, this.troll);
            expect(this.flaxia.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.flaxia.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
        });

        it('should last until start of next turn', function () {
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.player1.play(this.mutationOfCunning);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.flaxia);
            expect(this.flaxia.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.flaxia.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            expect(this.flaxia.getKeywordValue('elusive')).toBe(0);
        });
    });
});
