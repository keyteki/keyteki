describe('Lethologica', function () {
    describe("Lethologica's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['lethologica', 'troll', 'urchin', 'q-mechs']
                },
                player2: {}
            });

            this.player1.moveCard(this.qMechs, 'deck');
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.troll, 'deck');
        });

        it('discards until a Logos card and puts it in hand', function () {
            this.player1.play(this.lethologica);
            expect(this.troll.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.qMechs.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
