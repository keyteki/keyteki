describe('Titan Librarian', function () {
    describe("Titan Librarian's end-of-turn archive when off-flank", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['troll', 'krump'],
                    inPlay: ['lamindra', 'titan-librarian', 'urchin']
                },
                player2: {}
            });
        });

        it('archives a card at the end of turn when not on a flank', function () {
            this.player1.endTurn();
            expect(this.player1).toHavePrompt('Titan Librarian');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.krump.location).toBe('hand');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Titan Librarian on flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['troll'],
                    inPlay: ['titan-librarian', 'lamindra']
                },
                player2: {}
            });
        });

        it('does not trigger when on a flank', function () {
            this.player1.endTurn();
            expect(this.troll.location).toBe('hand');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
