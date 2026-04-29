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
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('the least powerful enemy creature captures 1 from its own side', function () {
            this.player1.reap(this.lyylyug);
            expect(this.player1).not.toBeAbleToSelect(this.lyylyug);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            // bumpsy power 3 < troll power 6
            expect(this.bumpsy.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
