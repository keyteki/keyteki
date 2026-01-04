describe('Shard of Resurgence', function () {
    describe("Shard of Resurgence's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['shard-of-resurgence', 'shard-of-hate'],
                    discard: ['echofly', 'blypyp', 'touchstone']
                },
                player2: {
                    amber: 2,
                    discard: ['dust-pixie']
                }
            });
        });

        it('should archive a card for each friendly shard', function () {
            this.player1.useAction(this.shardOfResurgence);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.touchstone);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.location).toBe('archives');
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.touchstone);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.touchstone);
            expect(this.touchstone.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
