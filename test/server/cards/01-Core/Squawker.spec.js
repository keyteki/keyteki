describe('Squawker', function () {
    describe("Squawker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['squawker'],
                    inPlay: ['zorg']
                },
                player2: {
                    inPlay: ['lamindra', 'mindwarper']
                }
            });
            this.zorg.exhausted = true;
            this.mindwarper.exhausted = true;
        });

        it('should ready a friendly Mars creature', function () {
            this.player1.play(this.squawker);
            expect(this.player1).toHavePrompt('Squawker');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.zorg.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready a friendly Mars creature', function () {
            this.player1.play(this.squawker);
            expect(this.player1).toHavePrompt('Squawker');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            this.player1.clickCard(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.mindwarper.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stun a non-Mars creature', function () {
            this.player1.play(this.squawker);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.lamindra.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
