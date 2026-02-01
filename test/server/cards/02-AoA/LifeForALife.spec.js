describe('Life for a Life', function () {
    describe("Life for a Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['life-for-a-life'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['tunk', 'batdrone']
                }
            });
        });

        it('should sacrifice a creature to deal 6 damage to a creature', function () {
            this.player1.play(this.lifeForALife);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);

            expect(this.dustPixie.location).toBe('discard');

            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.tunk);

            expect(this.tunk.tokens.damage).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
