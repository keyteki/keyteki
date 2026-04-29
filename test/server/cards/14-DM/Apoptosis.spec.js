describe('Apoptosis', function () {
    describe("Apoptosis's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['apoptosis'],
                    inPlay: ['echofly'],
                    discard: ['troll']
                },
                player2: {}
            });
        });

        it('purges a card from discard then a friendly creature captures 2', function () {
            this.player2.amber = 2;
            this.player1.play(this.apoptosis);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            expect(this.player1).toBeAbleToSelect(this.echofly);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Apoptosis with empty discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['apoptosis'],
                    inPlay: ['echofly']
                },
                player2: {}
            });
        });

        it('does not capture when discard is empty', function () {
            this.player1.play(this.apoptosis);
            // No discard targets - capture should not occur
            expect(this.echofly.amber).toBeFalsy();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
