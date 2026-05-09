describe('Agent Hoo-Man', function () {
    describe("Agent Hoo-Man's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['agent-hoo-man', 'tunk', 'lamindra', 'dodger']
                },
                player2: {
                    inPlay: ['john-smyth', 'mindwarper', 'batdrone', 'dextre']
                }
            });
        });

        it('should stun a friendly non-Mars creature and an enemy non-Mars creature on reap', function () {
            this.player1.reap(this.agentHooMan);

            // Choose a friendly non-Mars creatures
            expect(this.player1).not.toBeAbleToSelect(this.agentHooMan);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.lamindra);

            // Choose an enemy non-Mars creatures
            expect(this.player1).not.toBeAbleToSelect(this.agentHooMan);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.batdrone);

            expect(this.lamindra.stunned).toBe(true);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
