describe('Transposition Sandals', function () {
    describe("Transposition Sandals's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['transposition-sandals'],
                    inPlay: ['dextre', 'mindwarper', 'mother']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should grant action ability to swap with another friendly creature', function () {
            this.player1.playUpgrade(this.transpositionSandals, this.dextre);
            this.player1.useAction(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.mother);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.mother);
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.mindwarper);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.dextre);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow using the swapped creature this turn', function () {
            this.player1.playUpgrade(this.transpositionSandals, this.dextre);
            this.player1.useAction(this.dextre);
            this.player1.clickCard(this.mindwarper);
            this.player1.reap(this.mindwarper);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
