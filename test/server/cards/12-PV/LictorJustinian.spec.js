describe('Lictor Justinian', function () {
    describe("Lictor Justinian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['lictor-justinian'],
                    hand: ['spoils-of-battle']
                },
                player2: {
                    inPlay: ['krump', 'ancient-bear'],
                    hand: ['ember-imp']
                }
            });
        });

        it('should deal 1 damage to each enemy creature when opponent plays a card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.emberImp);

            expect(this.krump.tokens.damage).toBe(1);
            expect(this.ancientBear.tokens.damage).toBe(1);
            expect(this.emberImp.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not deal damage when controller plays a card', function () {
            this.player1.play(this.spoilsOfBattle);

            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.ancientBear.tokens.damage).toBeUndefined();
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
