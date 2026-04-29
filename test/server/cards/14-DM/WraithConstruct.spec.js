describe('Wraith Construct', function () {
    describe("Wraith Construct's start of turn ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['wraith-construct'],
                    hand: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('triggers at the start of player 1 turn and discards a chosen card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            // Wraith Construct triggers before house prompt
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('hand');
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger on opponent turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
            expect(this.troll.location).toBe('hand');
            expect(this.lamindra.location).toBe('hand');
        });
    });
});
