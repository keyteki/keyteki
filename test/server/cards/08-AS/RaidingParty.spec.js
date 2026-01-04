describe('Raiding Party', function () {
    describe("Raiding Party's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    inPlay: ['raiding-party']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should steal 1 on fight if no common keys forged', function () {
            this.player1.player.keys = { blue: true, red: false, yellow: false };
            this.player2.player.keys = { blue: false, red: false, yellow: true };
            this.player1.fightWith(this.raidingParty, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 2 on fight if a common key forged', function () {
            this.player1.player.keys = { blue: true, red: false, yellow: false };
            this.player2.player.keys = { blue: true, red: false, yellow: true };
            this.player1.fightWith(this.raidingParty, this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
