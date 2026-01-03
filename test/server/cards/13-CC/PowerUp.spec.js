describe('Power Up', function () {
    describe("Power Up's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['power-up', 'umbra'],
                    inPlay: ['bad-penny', 'dew-faerie']
                },
                player2: {
                    inPlay: ['krump', 'nexus']
                }
            });
        });

        it('should give two +1 power counters to a friendly creature', function () {
            this.player1.play(this.powerUp);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.getPower()).toBe(3);
            expect(this.powerUp.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should archive itself when target becomes the most powerful', function () {
            this.player2.moveCard(this.krump, 'discard');
            this.player1.play(this.powerUp);
            this.player1.clickCard(this.badPenny);
            expect(this.powerUp.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.powerUp);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
