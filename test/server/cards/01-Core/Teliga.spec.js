describe('Teliga', function () {
    describe("Teliga's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['teliga'],
                    hand: ['witch-of-the-eye']
                },
                player2: {
                    house: 'shadows',
                    hand: ['umbra', 'lamindra', 'urchin', 'subtle-maul']
                }
            });
        });

        it('should gain 1A for each creature opponent plays', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            this.player2.playCreature(this.umbra);
            expect(this.player1.amber).toBe(1);
            this.player2.playCreature(this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not gain amber when opponent plays non-creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.subtleMaul);
            expect(this.player1.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not gain amber when controller plays a creature', function () {
            this.player1.playCreature(this.witchOfTheEye);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow active player to order with other play abilities', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.urchin);
            this.player2.clickPrompt('Play this creature');
            expect(this.player2).toBeAbleToSelect(this.urchin);
            expect(this.player2).toBeAbleToSelect(this.teliga);
            this.player2.clickCard(this.teliga);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
