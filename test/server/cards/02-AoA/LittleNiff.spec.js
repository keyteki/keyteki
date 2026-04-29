describe('Little Niff', function () {
    describe('Little Niff ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['gamgee', 'knuckles-bolton', 'little-niff', 'bad-penny']
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
            expect(this.knucklesBolton.damage).toBe(1);
            expect(this.gamgee.damage).toBe(1);
            expect(this.littleNiff.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should steal 1A if destroyed during fight', function () {
            this.player1.fightWith(this.badPenny, this.ancientBear);
            expect(this.badPenny.location).toBe('hand');
            expect(this.ancientBear.damage).toBe(1);
            expect(this.knucklesBolton.damage).toBe(1);
            expect(this.littleNiff.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should steal 1A if destroyed due to hazardous', function () {
            this.player1.fightWith(this.knucklesBolton, this.briarGrubbling);
            expect(this.knucklesBolton.location).toBe('discard');
            expect(this.briarGrubbling.damage).toBe(0);
            expect(this.gamgee.damage).toBe(1);
            expect(this.littleNiff.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should cause fight damage if destroyed due to steal effect', function () {
            this.knucklesBolton.damage = 2;
            this.player1.fightWith(this.knucklesBolton, this.ancientBear);
            expect(this.knucklesBolton.location).toBe('discard');
            expect(this.ancientBear.damage).toBe(3);
            expect(this.gamgee.damage).toBe(1);
            expect(this.littleNiff.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
