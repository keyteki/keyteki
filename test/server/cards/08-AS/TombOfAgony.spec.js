describe("Pendra's Box", function () {
    describe("Pendra's Box's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['tomb-of-agony'],
                    inPlay: ['shooler', 'charette']
                },
                player2: {
                    inPlay: ['troll', 'groggins']
                }
            });
        });

        it('should purge an enemy creature when attached', function () {
            this.player1.playUpgrade(this.tombOfAgony, this.shooler);
            this.player1.reap(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe * 'purged';
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
