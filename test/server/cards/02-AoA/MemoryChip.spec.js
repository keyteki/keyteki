describe('Memory Chip', function () {
    describe("Memory Chip's reaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['troll'],
                    inPlay: ['memory-chip']
                },
                player2: {}
            });
        });

        it('archives a card after the controller chooses Logos as their active house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt('Memory Chip');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            this.player1.clickPrompt('No');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Memory Chip with a different active house', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll'],
                    inPlay: ['memory-chip']
                },
                player2: {}
            });
        });

        it('does not trigger when the active house is not Logos', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
