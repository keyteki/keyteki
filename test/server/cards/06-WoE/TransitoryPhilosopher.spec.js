describe('TransitoryPhilosopher', function () {
    describe("TransitoryPhilosopher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['transitory-philosopher']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump', 'obsidian-forge', 'shard-of-pain']
                }
            });
        });

        it('should steal 2 when there are 2 enemy artifacts', function () {
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.useAction(this.transitoryPhilosopher);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should do nothing if enemy has no artifacts', function () {
            this.player1.moveCard(this.obsidianForge, 'discard');
            this.player1.moveCard(this.shardOfPain, 'discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.useAction(this.transitoryPhilosopher);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.endTurn();
        });
    });
});
