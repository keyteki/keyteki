describe('Gorm of Omm', function () {
    describe("Gorm of Omm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'gorm-of-omm', 'shard-of-greed']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor', 'shard-of-pain']
                }
            });
        });

        it('should destroy itself and then prompt for artifact', function () {
            this.player1.useOmni(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.shardOfGreed);
            expect(this.player1).toBeAbleToSelect(this.shardOfPain);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            expect(this.player1).not.toBeAbleToSelect(this.halacor);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
        });

        it('should be able to destroy an enemy artifact', function () {
            this.player1.useOmni(this.gormOfOmm);
            this.player1.clickCard(this.shardOfPain);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.shardOfPain.location).toBe('discard');
        });

        it('should be able to destroy a friendly artifact', function () {
            this.player1.useOmni(this.gormOfOmm);
            this.player1.clickCard(this.shardOfGreed);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.shardOfGreed.location).toBe('discard');
        });
    });
});
