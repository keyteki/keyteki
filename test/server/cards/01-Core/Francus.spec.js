describe('Francus', function () {
    describe("Francus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['francus']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'zorg', 'bad-penny', 'splinter', 'shadow-self']
                }
            });

            this.zorg.tokens.damage = 1;
            this.shadowSelf.tokens.damage = 8;
        });

        it('should capture 1 amber when it lives and the opponent dies', function () {
            this.player1.fightWith(this.francus, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.francus.damage).toBe(4);
            expect(this.francus.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should capture 1 amber when it lives and the opponent has a destroyed effect', function () {
            this.player1.fightWith(this.francus, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.francus.armorUsed).toBe(1);
            expect(this.francus.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should not capture 1 amber when it lives and the opponent is warded', function () {
            this.docBookton.ward();
            this.player1.fightWith(this.francus, this.docBookton);
            expect(this.docBookton.location).toBe('play area');
            expect(this.docBookton.warded).toBe(false);
            expect(this.francus.damage).toBe(4);
            expect(this.francus.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it("should capture 1 amber when fighting shadow self's neighbor", function () {
            this.player1.fightWith(this.francus, this.splinter);
            expect(this.splinter.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.francus.armorUsed).toBe(1);
            expect(this.francus.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should not capture 1 amber when they both die', function () {
            this.player1.fightWith(this.francus, this.zorg);
            expect(this.zorg.location).toBe('discard');
            expect(this.francus.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should capture 1 amber and oppnent creature attacks it, it lives and the opponent dies', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.docBookton, this.francus);
            expect(this.docBookton.location).toBe('discard');
            expect(this.francus.damage).toBe(4);
            expect(this.francus.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player2.endTurn();
        });

        it('should not cause the controller of a creature attacking it to lose an amber when they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.zorg, this.francus);
            expect(this.zorg.location).toBe('discard');
            expect(this.francus.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player2.endTurn();
        });
    });
});
