describe('Raise Your Glass', function () {
    describe("Raise Your Glass's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['raise-your-glass'],
                    inPlay: ['dew-faerie', 'flaxia', 'rowdy-skald']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should ready and use the smallest creature', function () {
            this.player1.play(this.raiseYourGlass);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should choose a creature if there is a tie', function () {
            this.rowdySkald.exhaust();
            this.player1.moveCard(this.dewFaerie, 'discard');
            this.player1.play(this.raiseYourGlass);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            this.player1.clickCard(this.rowdySkald);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
