describe('All Are Mars', function () {
    describe('All Are Mars action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['all-are-mars', 'john-smyth', 'donor-vox']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('readies and uses a friendly creature', function () {
            this.donorVox.exhaust();
            this.player1.useAction(this.allAreMars);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.donorVox);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.donorVox);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.johnSmyth.exhausted).toBe(false);
            expect(this.donorVox.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
