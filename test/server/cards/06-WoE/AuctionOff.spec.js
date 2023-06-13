describe('Auction Off', function () {
    describe("Auction Off's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['pelf', 'ikwijĭ-outpost'],
                    hand: ['auction-off']
                },
                player2: {
                    hand: ['sneklifter'],
                    inPlay: ['gauntlet-of-command']
                }
            });
        });

        it('should not gain amber when there is no artifact in play', function () {
            this.ikwijĭOutpost.location = 'discard';
            this.gauntletOfCommand.location = 'discard';
            this.player1.play(this.auctionOff);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should gain current player an amber for a friendly artifact', function () {
            this.player1.play(this.auctionOff);
            expect(this.player1).toBeAbleToSelect(this.ikwijĭOutpost);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.ikwijĭOutpost);
            expect(this.ikwijĭOutpost.location).toBe('purged');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('should gain opponent an amber for an enemy artifact', function () {
            this.player1.play(this.auctionOff);
            expect(this.player1).toBeAbleToSelect(this.ikwijĭOutpost);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('purged');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
