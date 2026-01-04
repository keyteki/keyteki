describe('Facet', function () {
    describe("Facet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'facet',
                    inPlay: ['facet:toad', 'gub']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });

            this.facet = this.player1.player.creaturesInPlay[0];
        });

        it('should gain amber if destroyed on your turn', function () {
            this.player1.fightWith(this.facet, this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if destroyed on your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.facet);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
