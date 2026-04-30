describe('Parasitic Charge', function () {
    describe("Parasitic Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 14,
                    hand: ['parasitic-charge']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('forges a key at +8 and purges itself', function () {
            this.player1.play(this.parasiticCharge);
            this.player1.clickPrompt('Red');
            // Cost = 6 + 8 = 14
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.parasiticCharge.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('reduces cost by 1 per opp amber', function () {
            this.player2.player.amber = 5;
            this.player1.player.amber = 9;
            this.player1.play(this.parasiticCharge);
            this.player1.clickPrompt('Red');
            // Cost = 6 + 8 - 5 = 9
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.parasiticCharge.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not purge if cannot afford key', function () {
            this.player1.player.amber = 5;
            this.player1.play(this.parasiticCharge);
            // Not enough amber to forge
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.parasiticCharge.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
