describe('Cull the Weak', function () {
    describe("Cull the Weak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lamindra'],
                    hand: ['cull-the-weak']
                },
                player2: {
                    inPlay: ['dextre', 'brillix-ponder', 'batdrone']
                }
            });
        });

        it('should destroy the least powerful enemy creature', function () {
            this.player1.play(this.cullTheWeak);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.batdrone);
            expect(this.lamindra.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.brillixPonder.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prompt to choose when there is a tie for least powerful', function () {
            this.player2.moveCard(this.batdrone, 'hand');
            this.player1.play(this.cullTheWeak);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.brillixPonder);
            this.player1.clickCard(this.brillixPonder);
            expect(this.lamindra.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
