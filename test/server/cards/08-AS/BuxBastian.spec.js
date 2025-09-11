describe('Bux Bastian', function () {
    describe("Bux Bastian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['bux-bastian'],
                    inPlay: ['hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'gub', 'pelf']
                }
            });
        });

        it('should exatly an enemy flank creature on scrap', function () {
            this.player1.scrap(this.buxBastian);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.pelf.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
