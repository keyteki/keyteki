describe('Silent Dagger', function () {
    describe("Silent Dagger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['urchin'],
                    hand: ['silent-dagger']
                },
                player2: {
                    inPlay: ['troll', 'lamindra', 'batdrone']
                }
            });
        });

        it('should deal 4 damage to flank creature after reap', function () {
            this.player1.playUpgrade(this.silentDagger, this.urchin);
            this.player1.reap(this.urchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Silent Dagger');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
