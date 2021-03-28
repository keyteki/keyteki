describe('Krump', function () {
    describe("Krump's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'Brobnar',
                    inPlay: ['krump']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater']
                }
            });
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent dies', function () {
            this.player1.fightWith(this.krump, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.krump.tokens.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
        });
        it('should not cause the controller of a creature it attacks  it to lose an amber when they both die', function () {
            this.player1.fightWith(this.krump, this.brainEater);
            expect(this.brainEater.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
        });
        it('should cause the controller of a creature attacking it to lose an amber when it lives and the opponent dies', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.docBookton, this.krump);
            expect(this.docBookton.location).toBe('discard');
            expect(this.krump.tokens.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
        });
        it('should not cause the controller of a creature attacking it to lose an amber when they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.krump);
            expect(this.brainEater.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
        });
    });
});
