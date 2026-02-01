describe('Golden Aura', function () {
    describe("Golden Aura's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['golden-aura'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
            this.tunk.tokens.damage = 5;
        });

        it('should fully heal the chosen creature and make it Sanctum and immune to damage', function () {
            this.player1.play(this.goldenAura);

            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.tunk);

            expect(this.tunk.tokens.damage).toBeUndefined();
            expect(this.tunk.hasHouse('sanctum')).toBe(true);

            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.lamindra, this.tunk);

            expect(this.tunk.tokens.damage).toBeUndefined();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
