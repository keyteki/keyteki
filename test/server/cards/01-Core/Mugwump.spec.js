describe('Mugwump', function () {
    describe("Mugwump's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mugwump']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater', 'bad-penny']
                }
            });
        });

        it('should fully heal and add 1 power token when it lives and the opponent dies', function () {
            this.player1.fightWith(this.mugwump, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.mugwump.powerCounters).toBe(1);
            expect(this.mugwump.damage).toBe(0);
            this.player1.endTurn();
        });

        it('should fully heal and add 1 power token when it lives and the opponent has a destroyed effect', function () {
            this.player1.fightWith(this.mugwump, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.mugwump.damage).toBe(0);
            expect(this.mugwump.powerCounters).toBe(1);
            this.player1.endTurn();
        });

        it('should not fully heal and add 1 power token when it lives and the opponent is warded', function () {
            this.docBookton.ward();
            this.player1.fightWith(this.mugwump, this.docBookton);
            expect(this.docBookton.location).toBe('play area');
            expect(this.docBookton.warded).toBe(false);
            expect(this.mugwump.damage).toBe(5);
            expect(this.mugwump.powerCounters).toBe(0);
            this.player1.endTurn();
        });

        it('should not fully heal and add 1 power token when they both die', function () {
            this.player1.fightWith(this.mugwump, this.brainEater);
            expect(this.brainEater.location).toBe('discard');
            expect(this.mugwump.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should fully heal and add 1 power token and oppnent creature attacks it, it lives and the opponent dies', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.docBookton, this.mugwump);
            expect(this.docBookton.location).toBe('discard');
            expect(this.mugwump.damage).toBe(0);
            expect(this.mugwump.powerCounters).toBe(1);
            this.player2.endTurn();
        });

        it('should not cause the controller of a creature attacking it to lose an amber when they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.mugwump);
            this.player2.endTurn();
        });
    });
});
