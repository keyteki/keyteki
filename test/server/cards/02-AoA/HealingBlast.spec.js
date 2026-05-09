describe('Healing Blast', function () {
    describe("Healing Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['healing-blast'],
                    inPlay: ['zorg', 'tunk']
                },
                player2: {}
            });
            this.zorg.damage = 5;
            this.tunk.damage = 5;
        });

        it('should fully heal a creature and gain 2 amber if healed 4 or more', function () {
            this.player1.play(this.healingBlast);

            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.zorg);

            expect(this.zorg.damage).toBe(0);
            expect(this.tunk.damage).toBe(5);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if healed less than 4 damage', function () {
            this.zorg.damage = 3;
            this.player1.play(this.healingBlast);

            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.zorg);

            expect(this.zorg.damage).toBe(0);
            expect(this.tunk.damage).toBe(5);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
