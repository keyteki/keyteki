describe('Grumpus Tamer', function () {
    describe("Grumpus Tamer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grumpus-tamer'],
                    hand: ['troll', 'war-grumpus', 'war-grumpus']
                },
                player2: {}
            });
            this.warGrumpus1 = this.player1.player.hand[1];
            this.warGrumpus2 = this.player1.player.hand[2];

            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.warGrumpus1, 'deck');
            this.player1.moveCard(this.warGrumpus2, 'deck');
        });

        it('should search deck for a War Grumpus on reap', function () {
            this.player1.reap(this.grumpusTamer);
            expect(this.player1.hasPrompt('Choose a card')).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.warGrumpus1);
            expect(this.player1).toBeAbleToSelect(this.warGrumpus2);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.warGrumpus1);
            this.player1.clickPrompt('Done');

            expect(this.troll.location).toBe('deck');
            expect(this.warGrumpus1.location).toBe('hand');
            expect(this.warGrumpus2.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();

            this.grumpusTamer.exhausted = false;
            this.player1.reap(this.grumpusTamer);
            expect(this.player1.hasPrompt('Choose a card')).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.warGrumpus1);
            expect(this.player1).toBeAbleToSelect(this.warGrumpus2);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.warGrumpus2);
            this.player1.clickPrompt('Done');

            expect(this.troll.location).toBe('deck');
            expect(this.warGrumpus1.location).toBe('hand');
            expect(this.warGrumpus2.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
