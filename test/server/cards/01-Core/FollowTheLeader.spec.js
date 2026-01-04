describe('Follow the Leader', function () {
    describe("Follow the Leader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['follow-the-leader'],
                    inPlay: ['sequis', 'doc-bookton']
                },
                player2: {
                    inPlay: ['ember-imp', 'charette']
                }
            });
        });

        it('should allow friendly creatures to fight for the rest of the turn', function () {
            this.player1.play(this.followTheLeader);
            this.player1.fightWith(this.sequis, this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.player1.fightWith(this.docBookton, this.charette);
            expect(this.charette.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.docBookton);
        });
    });
});
