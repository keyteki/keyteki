describe('Titan Apparition', function () {
    describe("Titan Apparition's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['titan-apparition']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('discards 5 cards from your deck when destroyed on your turn', function () {
            this.player1.fightWith(this.titanApparition, this.troll);
            expect(this.player1.discard.length).toBe(6);
            expect(this.player2.discard.length).toBe(0);
        });

        it('discards 5 cards from your opponent deck when destroyed on not your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.titanApparition);
            expect(this.player1.discard.length).toBe(1);
            expect(this.player2.discard.length).toBe(5);
        });
    });
});
