describe('Shorty’s Brew', function () {
    describe("Shorty’s Brew's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['shorty-s-brew']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch']
                }
            });
        });

        it('gives the chosen creature 2 power counters and can target either side', function () {
            this.player1.play(this.shortySBrew);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.troll);
            expect(this.ancientBear.powerCounters).toBe(0);
            expect(this.troll.powerCounters).toBe(2);
            expect(this.mightyTiger.powerCounters).toBe(0);
            expect(this.huntingWitch.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
