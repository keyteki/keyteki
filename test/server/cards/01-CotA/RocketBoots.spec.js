describe('Rocket Boots', function () {
    describe("Rocket Boots's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['rocket-boots'],
                    inPlay: ['batdrone']
                },
                player2: {
                    amber: 2,
                    inPlay: ['snufflegator']
                }
            });
        });

        it('should ready the character once after reaping with it', function () {
            this.player1.playUpgrade(this.rocketBoots, this.batdrone);
            expect(this.rocketBoots.location).toBe('play area');
            this.player1.reap(this.batdrone);
            expect(this.player1.amber).toBe(1);
            expect(this.batdrone.exhausted).toBe(false);
            this.player1.reap(this.batdrone);
            expect(this.player1.amber).toBe(2);
            expect(this.batdrone.exhausted).toBe(true);
        });

        it('should ready the character once after fighting with it', function () {
            this.player1.playUpgrade(this.rocketBoots, this.batdrone);
            expect(this.rocketBoots.location).toBe('play area');
            this.player1.fightWith(this.batdrone, this.snufflegator);
            expect(this.snufflegator.tokens.damage).toBe(2);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Batdrone');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.batdrone.exhausted).toBe(false);
            this.player1.fightWith(this.batdrone, this.snufflegator);
            expect(this.snufflegator.location).toBe('discard');
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
    });
});
