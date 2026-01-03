describe('Codex of True Names', function () {
    describe("Codex of True Names's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['gub', 'codex-of-true-names'],
                    deck: ['toad', 'toad', 'toad']
                },
                player2: {
                    inPlay: ['lamindra', 'umbra', 'old-bruno']
                }
            });

            this.toad1 = this.player1.deck[0];
            this.toad2 = this.player1.deck[1];
            this.toad3 = this.player1.deck[2];
        });

        it('destroy itself and do nothing else if no tokens', function () {
            this.player1.useAction(this.codexOfTrueNames);
            expect(this.codexOfTrueNames.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.umbra.location).toBe('play area');
            expect(this.oldBruno.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('return one token to hand and one enemy creature', function () {
            this.player1.makeTokenCreature();
            expect(this.toad1.location).toBe('play area');
            this.player1.useAction(this.codexOfTrueNames);
            expect(this.toad1.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.umbra);
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.umbra.location).toBe('hand');
            expect(this.oldBruno.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('return two tokens to hand and two enemy creatures', function () {
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            this.player1.useAction(this.codexOfTrueNames);
            expect(this.toad1.location).toBe('hand');
            expect(this.toad2.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.oldBruno);
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.oldBruno.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not count warded Fiends', function () {
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.toad2.ward();
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            this.player1.useAction(this.codexOfTrueNames);
            expect(this.toad1.location).toBe('hand');
            expect(this.toad2.location).toBe('play area');
            expect(this.toad2.warded).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('hand');
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.oldBruno.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be able to pop warded enemy creatures with two returns', function () {
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.umbra.ward();
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            this.player1.useAction(this.codexOfTrueNames);
            expect(this.toad1.location).toBe('hand');
            expect(this.toad2.location).toBe('hand');
            expect(this.toad2.warded).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.oldBruno.location).toBe('play area');
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('hand');
            expect(this.gub.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.oldBruno.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
