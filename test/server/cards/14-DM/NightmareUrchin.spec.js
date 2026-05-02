describe('Nightmare Urchin', function () {
    describe("Nightmare Urchin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nightmare-urchin']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('steals 2 when overwhelmed after reap', function () {
            this.player1.reap(this.nightmareUrchin);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 1 when not overwhelmed', function () {
            this.player2.moveCard(this.troll, 'hand');
            this.player1.reap(this.nightmareUrchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
