describe('Lyylyug', function () {
    describe("Lyylyug's reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['lyylyug', 'john-smyth']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'bumpsy', 'cowfyne']
                }
            });
        });

        it('the least powerful enemy creature captures 1 from its own side', function () {
            this.player1.reap(this.lyylyug);
            expect(this.player1).not.toBeAbleToSelect(this.lyylyug);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.cowfyne);
            this.player1.clickCard(this.bumpsy);
            expect(this.lyylyug.amber).toBe(0);
            expect(this.johnSmyth.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.bumpsy.amber).toBe(1);
            expect(this.cowfyne.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
