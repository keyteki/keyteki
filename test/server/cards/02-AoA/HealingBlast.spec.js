describe('Healing Blast', function () {
    describe("Healing Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['healing-blast'],
                    inPlay: ['tunk']
                },
                player2: {}
            });
            this.tunk.tokens.damage = 5;
        });

        it('should fully heal a creature and gain 2 amber if healed 4 or more', function () {
            this.player1.play(this.healingBlast);

            expect(this.player1).toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.tunk);

            expect(this.tunk.tokens.damage).toBeUndefined();
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if healed less than 4 damage', function () {
            this.tunk.tokens.damage = 3;
            this.player1.play(this.healingBlast);

            expect(this.player1).toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.tunk);

            expect(this.tunk.tokens.damage).toBeUndefined();
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
