describe('Ley Lines', function () {
    describe("Ley Lines's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['ley-lines'],
                    inPlay: ['caspart']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('exhausts each creature when overwhelmed', function () {
            this.player1.play(this.leyLines);
            expect(this.caspart.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('exhausts a single creature when not overwhelmed', function () {
            this.player2.moveCard(this.urchin, 'discard');
            this.player2.moveCard(this.bumpsy, 'discard');
            this.player1.play(this.leyLines);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.caspart.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
