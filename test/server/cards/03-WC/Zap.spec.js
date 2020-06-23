describe('Zap', function () {
    describe("Zap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['zap'],
                    inPlay: ['spyyyder']
                },
                player2: {
                    inPlay: ['troll', 'snufflegator']
                }
            });
            this.player1.play(this.zap);
        });

        it('should deal damage for the houses in play [3]', function () {
            expect(this.player1).toHavePrompt('Zap');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.spyyyder);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
        });

        it('should not allow the player to select 0 targets', function () {
            expect(this.player1.currentButtons).not.toContain('Done');
        });

        it('should deal damage for the houses in play [3] to different creatures', function () {
            expect(this.player1).toHavePrompt('Zap');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.spyyyder);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.spyyyder);
            this.player1.clickCard(this.snufflegator);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.spyyyder.tokens.damage).toBe(1);
            expect(this.snufflegator.tokens.damage).toBe(1);
        });
    });
});
