describe('Narplet', function () {
    describe("Narplet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['narplet', 'rowdy-skald'],
                    inPlay: ['nexus', 'dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should give neighbors versatile', function () {
            this.player1.playCreature(this.narplet);
            this.player1.clickCard(this.nexus);
            this.expectReadyToTakeAction(this.player1);
            this.player1.reap(this.dustPixie);
            expect(this.player1.amber).toBe(2);
            this.player1.playCreature(this.rowdySkald);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            this.player2.endTurn();

            this.player1.clickPrompt('shadows');
            this.player1.clickCard(this.narplet);
            this.expectReadyToTakeAction(this.player1);
            this.player1.reap(this.rowdySkald);
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
