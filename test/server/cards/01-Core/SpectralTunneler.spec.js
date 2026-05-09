describe('Spectral Tunneler', function () {
    describe("Spectral Tunneler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['spectral-tunneler', 'snudge', 'batdrone', 'shooler']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should make a creature considered as flank and give reap draw ability', function () {
            expect(this.batdrone.isOnFlank()).toBe(false);
            this.player1.useAction(this.spectralTunneler);
            expect(this.player1).toHavePrompt('Spectral Tunneler');
            expect(this.player1).toBeAbleToSelect(this.snudge);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.isOnFlank()).toBe(true);
            this.player1.reap(this.batdrone);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only last until end of turn', function () {
            this.player1.useAction(this.spectralTunneler);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.isOnFlank()).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.batdrone.isOnFlank()).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
