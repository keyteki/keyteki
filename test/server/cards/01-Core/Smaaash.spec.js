describe('Smaaash', function () {
    describe("Smaaash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['smaaash']
                },
                player2: {
                    inPlay: ['lamindra', 'batdrone']
                }
            });
        });

        it('should stun a creature when played', function () {
            this.player1.play(this.smaaash);
            expect(this.player1).toHavePrompt('Smaaash');
            expect(this.player1).toBeAbleToSelect(this.smaaash);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.lamindra);
            expect(this.smaaash.stunned).toBe(false);
            expect(this.lamindra.stunned).toBe(true);
            expect(this.batdrone.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to stun own creature', function () {
            this.player1.play(this.smaaash);
            expect(this.player1).toBeAbleToSelect(this.smaaash);
            this.player1.clickCard(this.smaaash);
            expect(this.smaaash.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
