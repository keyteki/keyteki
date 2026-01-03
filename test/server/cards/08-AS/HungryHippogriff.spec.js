describe('Hungry Hippogriff', function () {
    describe("Hungry Hippogriff's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['hungry-hippogriff', 'rowdy-skald']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump', 'troll']
                }
            });

            this.hungryHippogriff.amber = 2;
            this.rowdySkald.amber = 2;
            this.krump.amber = 2;
        });

        it('should give other creatures a destroyed ability to move amber to your pool', function () {
            this.player1.fightWith(this.rowdySkald, this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player1.fightWith(this.hungryHippogriff, this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not give enemy creatures a destroyed ability', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.krump, this.hungryHippogriff);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
