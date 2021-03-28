describe('Charge!', function () {
    describe("Charge!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['charge', 'bulwark', 'grey-monk', 'barrister-joya', 'gorm-of-omm']
                },
                player2: {
                    inPlay: ['troll', 'alaka', 'groke', 'ogopogo']
                }
            });
        });

        it('should allow future creatures to deal 2D after play', function () {
            this.player1.play(this.bulwark);
            this.player1.play(this.charge);
            this.player1.play(this.gormOfOmm);
            this.player1.play(this.greyMonk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.ogopogo);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.greyMonk);
            this.player1.clickCard(this.troll);
            this.player1.play(this.barristerJoya);
            this.player1.clickCard(this.ogopogo);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.ogopogo.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
