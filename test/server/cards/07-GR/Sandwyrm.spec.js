describe('Sandwyrm', function () {
    describe("Sandwyrm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['sandwyrm']
                },
                player2: {
                    inPlay: ['troll', 'thing-from-the-deep']
                }
            });
        });

        it('shuffles into deck after fight', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.fightWith(this.sandwyrm, this.troll);
            expect(this.sandwyrm.location).toBe('deck');
            expect(this.troll.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does nothing after dying in fight', function () {
            this.player1.fightWith(this.sandwyrm, this.thingFromTheDeep);
            expect(this.sandwyrm.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
