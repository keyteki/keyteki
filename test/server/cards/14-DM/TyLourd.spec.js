describe('Ty Lourd', function () {
    describe('Ty Lourd when opponent discards from hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['ty-lourd']
                },
                player2: {
                    house: 'brobnar',
                    hand: ['troll']
                }
            });
        });

        it('gains 1 amber for each card discarded', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.scrap(this.troll);
            expect(this.player1.amber).toBe(1);
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ty Lourd when an opponent's creature is discarded from play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['ty-lourd']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not gain amber', function () {
            this.player2.moveCard(this.troll, 'discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
