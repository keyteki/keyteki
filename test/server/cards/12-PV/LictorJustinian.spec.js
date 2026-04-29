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

            expect(this.krump.damage).toBe(1);
            expect(this.ancientBear.damage).toBe(1);
            expect(this.emberImp.damage).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not deal damage when controller plays a card', function () {
            this.player1.play(this.spoilsOfBattle);

            expect(this.krump.damage).toBe(0);
            expect(this.ancientBear.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
