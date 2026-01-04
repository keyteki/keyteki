describe('Memette', function () {
    describe("Memette's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['memette'],
                    discard: ['flaxia', 'shadys', 'full-moon']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.player1.playCreature(this.memette);
            this.player1.chains = 36;
        });

        it('archives the top card of discard pile on play', function () {
            expect(this.flaxia.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives the top card of discard pile on destroy', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.memette);
            expect(this.memette.location).toBe('discard');
            expect(this.shadys.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
