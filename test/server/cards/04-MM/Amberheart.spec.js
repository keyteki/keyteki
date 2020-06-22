describe('Amberheart', function () {
    describe("Amberheart's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['æmberheart', 'bulwark', 'bull-wark']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should exalt, ward and fully heal a friendly creature', function () {
            this.bulwark.tokens.damage = 2;

            this.player1.useAction(this.æmberheart);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.bullWark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);

            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.tokens.damage).toBeUndefined();
            expect(this.bulwark.tokens.ward).toBe(1);
            expect(this.bulwark.tokens.amber).toBe(1);
        });
    });
});
