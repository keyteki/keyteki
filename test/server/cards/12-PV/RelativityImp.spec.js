describe('Relativity Imp', function () {
    describe("Relativity Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 23,
                    hand: ['relativity-imp'],
                    inPlay: ['obsidian-forge']
                },
                player2: {
                    amber: 12,
                    inPlay: ['krump']
                }
            });
        });

        it('should allow forging two keys when played', function () {
            this.player1.play(this.relativityImp);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.forgeKey('Blue');
            this.player1.clickPrompt('dis');
            expect(this.player1.amber).toBe(12);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow forging a third key in the same turn', function () {
            this.player1.play(this.relativityImp);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.forgeKey('Blue');
            this.player1.clickPrompt('dis');
            this.player1.useAction(this.obsidianForge);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
