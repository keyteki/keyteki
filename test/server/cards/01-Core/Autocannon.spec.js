describe('Autocannon', function () {
    describe("Autocannon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nexus', 'urchin']
                },
                player2: {
                    amber: 1,
                    inPlay: ['autocannon'],
                    hand: ['pingle-who-annoys']
                }
            });
        });

        it('should deal 1 damage to enemy creature when it enters play', function () {
            this.player1.play(this.nexus);
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.damage).toBe(1);
        });

        it('should deal 1 damage to own creature when it enters play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.pingleWhoAnnoys);
            expect(this.pingleWhoAnnoys.location).toBe('play area');
            expect(this.pingleWhoAnnoys.damage).toBe(1);
        });

        it('should prompt the player whether to trigger Urchin or Autocannon first', function () {
            this.player1.play(this.urchin);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.autocannon);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
