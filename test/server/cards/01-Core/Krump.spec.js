describe('Krump', function () {
    describe("Krump's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['krump']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater', 'bad-penny']
                }
            });
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent dies', function () {
            this.player1.fightWith(this.krump, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.krump.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should cause the controller of a creature it attacks to lose an amber when it lives and the opponent has a destroyed effect', function () {
            this.player1.fightWith(this.krump, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.krump.damage).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should not cause the controller of a creature it attacks to lose an amber when it lives and the opponent is warded', function () {
            this.docBookton.ward();
            this.player1.fightWith(this.krump, this.docBookton);
            expect(this.docBookton.location).toBe('play area');
            expect(this.docBookton.warded).toBe(false);
            expect(this.krump.damage).toBe(5);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should not cause the controller of a creature it attacks to lose an amber when they both die', function () {
            this.player1.fightWith(this.krump, this.brainEater);
            expect(this.brainEater.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should cause the controller of a creature attacking it to lose an amber when it lives and the opponent dies', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.docBookton, this.krump);
            expect(this.docBookton.location).toBe('discard');
            expect(this.krump.damage).toBe(5);
            expect(this.player2.amber).toBe(2);
            this.player2.endTurn();
        });

        it('should not cause the controller of a creature attacking it to lose an amber when they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.krump);
            expect(this.brainEater.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            this.player2.endTurn();
        });
    });
});
