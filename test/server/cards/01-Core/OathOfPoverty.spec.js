describe('Oath of Poverty', function () {
    describe("Oath of Poverty's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['oath-of-poverty'],
                    inPlay: ['the-vaultkeeper', 'the-big-one', 'gorm-of-omm']
                },
                player2: {
                    inPlay: ['mighty-javelin']
                }
            });
        });

        it('should destroy all friendly artifacts and gain 2 amber per artifact', function () {
            this.player1.play(this.oathOfPoverty);
            expect(this.theVaultkeeper.location).toBe('play area');
            expect(this.theBigOne.location).toBe('discard');
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.mightyJavelin.location).toBe('play area');
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain no amber if no artifacts in play', function () {
            this.player1.moveCard(this.theBigOne, 'discard');
            this.player1.moveCard(this.gormOfOmm, 'discard');
            this.player1.play(this.oathOfPoverty);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
