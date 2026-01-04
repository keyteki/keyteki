describe("Pendra's Box", function () {
    describe("Pendra's Box's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['pendra-s-box']
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'groke', 'ironyx-rebel']
                }
            });
        });

        it('should exalt creature and neighbors on reap when attached', function () {
            this.player1.playUpgrade(this.pendraSBox, this.groggins);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.groggins);
            expect(this.troll.amber).toBe(1);
            expect(this.groggins.amber).toBe(1);
            expect(this.groke.amber).toBe(1);
            expect(this.ironyxRebel.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
