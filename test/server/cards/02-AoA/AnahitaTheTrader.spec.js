describe('Anahita the Trader', function () {
    describe("Anahita the Trader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 0,
                    inPlay: ['anahita-the-trader', 'potion-of-invulnerability'],
                    hand: ['martian-generosity']
                },
                player2: {
                    amber: 2,
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
        });

        it('should prompt give away an artifact when she reaps, taking 2A from opponent', function () {
            this.player1.reap(this.anahitaTheTrader);
            expect(this.player1).toHavePrompt('Anahita the Trader');
            expect(this.player1).toBeAbleToSelect(this.potionOfInvulnerability);
            expect(this.player1).not.toBeAbleToSelect(this.anahitaTheTrader);
            this.player1.clickCard(this.potionOfInvulnerability);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
        });
        it('should prompt give away an artifact when she reaps, taking 1A from opponent if thats all they have', function () {
            this.player2.amber = 1;
            this.player1.reap(this.anahitaTheTrader);
            expect(this.player1).toHavePrompt('Anahita the Trader');
            expect(this.player1).toBeAbleToSelect(this.potionOfInvulnerability);
            expect(this.player1).not.toBeAbleToSelect(this.anahitaTheTrader);
            this.player1.clickCard(this.potionOfInvulnerability);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
        it('should prompt give away an artifact when she reaps, taking nothing from opponent they are at 0 already', function () {
            this.player2.amber = 0;
            this.player1.reap(this.anahitaTheTrader);
            expect(this.player1).toHavePrompt('Anahita the Trader');
            expect(this.player1).toBeAbleToSelect(this.potionOfInvulnerability);
            expect(this.player1).not.toBeAbleToSelect(this.anahitaTheTrader);
            this.player1.clickCard(this.potionOfInvulnerability);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
    describe("Anahita the Trader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 0,
                    inPlay: ['anahita-the-trader'],
                    hand: ['martian-generosity']
                },
                player2: {
                    amber: 2,
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
        });

        it('should reap with no other interactions if she has no artifacts in play.', function () {
            this.player1.reap(this.anahitaTheTrader);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
