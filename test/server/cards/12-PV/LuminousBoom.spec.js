describe('Luminous Boom', function () {
    describe("Luminous Boom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['luminous-boom', 'bulwark', 'dust-pixie'],
                    inPlay: ['champion-tabris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia']
                }
            });
        });

        it('should capture all opponent amber when discarding a Sanctum card', function () {
            this.player1.play(this.luminousBoom);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.championTabris);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.championTabris);
            expect(this.championTabris.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not capture amber if no Sanctum card is discarded', function () {
            this.player1.play(this.luminousBoom);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
