describe('Sic Semper Tyrannosaurus', function () {
    describe("Sic Semper Tyrannosaurus's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['sic-semper-tyrannosaurus', 'brutodon-auxiliary'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['redlock', 'krump']
                }
            });
        });

        it('should destroy most powerful creature and gain no amber', function () {
            this.player1.play(this.sicSemperTyrannosaurus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
        });

        it('should destroy most powerful creature and gain all amber on it', function () {
            this.redlock.tokens.amber = 10;
            this.krump.tokens.amber = 4;
            this.player1.play(this.sicSemperTyrannosaurus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
        });

        it('should allow select most powerful creature, destroy it and gain all amber on it', function () {
            this.player1.playCreature(this.brutodonAuxiliary);
            this.brutodonAuxiliary.tokens.amber = 8;
            this.player1.play(this.sicSemperTyrannosaurus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.brutodonAuxiliary.location).toBe('discard');
            expect(this.player1.amber).toBe(8);
        });

        it('should allow select most powerful creature, remove its ward and gain all amber on it', function () {
            this.player1.playCreature(this.brutodonAuxiliary);
            this.brutodonAuxiliary.tokens.amber = 8;
            this.brutodonAuxiliary.ward();
            this.player1.play(this.sicSemperTyrannosaurus);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.brutodonAuxiliary.warded).toBe(false);
            expect(this.brutodonAuxiliary.amber).toBe(0);
            expect(this.player1.amber).toBe(8);
        });
    });
});
