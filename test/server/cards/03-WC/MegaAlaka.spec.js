describe('Mega Alaka', function () {
    describe("Mega Alaka's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['mega-alaka']
                },
                player2: {
                    inPlay: ['nexus']
                }
            });
        });

        it('enters play exhausted when no creature has fought this turn', function () {
            this.player1.play(this.megaAlaka);
            expect(this.megaAlaka.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('enters play ready when a friendly creature has already fought this turn', function () {
            this.player1.fightWith(this.troll, this.nexus);
            this.player1.play(this.megaAlaka);
            expect(this.megaAlaka.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
