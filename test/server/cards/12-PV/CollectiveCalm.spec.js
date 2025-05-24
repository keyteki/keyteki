describe('Collective Calm', function () {
    describe("Collective Calm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['collective-calm', 'bulwark', 'champion-tabris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should give each creature a reap ability to gain 1 amber', function () {
            this.player1.reap(this.bulwark);
            expect(this.player1.amber).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.player2.amber).toBe(6);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be destroyed after a friendly creature fights', function () {
            this.player1.fightWith(this.bulwark, this.flaxia);
            expect(this.collectiveCalm.location).toBe('discard');
            this.player1.reap(this.championTabris);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be destroyed after an enemy creature fights', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.flaxia, this.bulwark);
            expect(this.collectiveCalm.location).toBe('play area');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
