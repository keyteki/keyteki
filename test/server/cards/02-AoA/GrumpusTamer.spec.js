describe('Grumpus Tamer', function () {
    describe("Grumpus Tamer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grumpus-tamer']
                },
                player2: {}
            });
            this.player1.moveCard(
                this.player1.player.findCardByName('war-grumpus', 'deck'),
                'deck'
            );
        });

        it('should search deck for a War Grumpus on reap', function () {
            this.player1.reap(this.grumpusTamer);
            this.player1.clickPrompt('War Grumpus');

            let warGrumpus = this.player1.player.hand.find((card) => card.name === 'War Grumpus');
            expect(warGrumpus).not.toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
