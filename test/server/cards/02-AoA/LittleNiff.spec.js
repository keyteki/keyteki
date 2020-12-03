describe('Little Niff', function () {
    describe('Little Niff ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['gamgee', 'knuckles-bolton', 'little-niff']
                },
                player2: {
                    amber: 3,
                    inPlay: ['molephin', 'lamindra', 'briar-grubbling', 'ancient-bear']
                }
            });
        });

        it('should not steal if fighting with Little Niff', function () {
            this.player1.fightWith(this.littleNiff, this.lamindra);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not steal if fighting with non-neighbor of Little Niff', function () {
            this.player1.fightWith(this.gamgee, this.lamindra);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal if fighting with neighbor of Little Niff', function () {
            this.player1.fightWith(this.knucklesBolton, this.lamindra);
            expect(this.knucklesBolton.tokens.damage).toBe(1);
            expect(this.gamgee.tokens.damage).toBe(1);
            expect(this.littleNiff.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should steal 1A if destroyed due to hazardous', function () {
            this.player1.fightWith(this.knucklesBolton, this.briarGrubbling);
            expect(this.knucklesBolton.location).toBe('discard');
            expect(this.briarGrubbling.tokens.damage).toBeUndefined();
            expect(this.gamgee.tokens.damage).toBe(1);
            expect(this.littleNiff.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should cause fight damage if destroyed due to steal effect', function () {
            this.knucklesBolton.tokens.damage = 2;
            this.player1.fightWith(this.knucklesBolton, this.ancientBear);
            expect(this.knucklesBolton.location).toBe('discard');
            expect(this.ancientBear.tokens.damage).toBe(3);
            expect(this.gamgee.tokens.damage).toBe(1);
            expect(this.littleNiff.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
