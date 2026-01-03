describe('Memorialize the Fallen', function () {
    describe("Memorialize the Fallen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'brobnar',
                    hand: ['memorialize-the-fallen'],
                    inPlay: ['groke'],
                    discard: ['troll', 'stealth-mode', 'cpo-zytar']
                },
                player2: {
                    amber: 5,
                    discard: ['mollymawk', 'ritual-of-balance', 'flaxia', 'dust-pixie', 'full-moon']
                }
            });
        });

        it('each player loses amber', function () {
            this.player1.play(this.memorializeTheFallen);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('works when you have more creatures than amber', function () {
            this.player1.amber = 1;
            this.player1.play(this.memorializeTheFallen);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
