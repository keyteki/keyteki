describe('Batdrone', function () {
    describe("Batdrone's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'briar-grubbling']
                }
            });
        });

        it('should steal 1 amber when fighting', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            this.player1.fightWith(this.batdrone, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should have skirmish and take no damage when fighting', function () {
            this.player1.fightWith(this.batdrone, this.troll);
            expect(this.batdrone.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should not steal amber when opponent has no amber', function () {
            this.player2.amber = 0;
            expect(this.player1.amber).toBe(0);
            this.player1.fightWith(this.batdrone, this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should not steal with hazardous creatures', function () {
            this.player1.fightWith(this.batdrone, this.briarGrubbling);
            expect(this.batdrone.location).toBe('discard');
            expect(this.briarGrubbling.tokens.damage).toBe(undefined);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });
});
