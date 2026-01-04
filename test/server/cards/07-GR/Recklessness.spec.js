describe('Recklessness', function () {
    describe("Recklessness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['recklessness', 'auction-off', 'mass-buyout']
                },
                player2: {
                    amber: 1,
                    hand: ['stealth-mode', 'timetraveller', 'rogue-operation']
                }
            });
        });

        it('each player discards 3 and draws 3', function () {
            this.player1.play(this.recklessness);
            expect(this.auctionOff.location).toBe('discard');
            expect(this.massBuyout.location).toBe('discard');
            expect(this.stealthMode.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.rogueOperation.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
