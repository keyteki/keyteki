describe('Discombobulator', function () {
    describe("Discombobulator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['eyegor'],
                    hand: ['discombobulator']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin', 'dextre']
                }
            });
        });

        it('should not allow amber to be stolen while it is in play', function () {
            this.player1.playUpgrade(this.discombobulator, this.eyegor);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.endTurn();
            expect(this.discombobulator.location).toBe('play area');
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should allow amber to be captured or lost', function () {
            this.player1.playUpgrade(this.discombobulator, this.eyegor);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.endTurn();
            expect(this.discombobulator.location).toBe('play area');
            this.player2.clickPrompt('logos');
            this.player2.play(this.dextre);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.dextre.tokens.amber).toBe(1);
        });
    });
});
