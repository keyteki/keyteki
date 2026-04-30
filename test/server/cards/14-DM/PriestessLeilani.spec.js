describe('Priestess Leilani', function () {
    describe("Priestess Leilani's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['priestess-leilani', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('exhausts an enemy creature and readies a non-Priest friendly creature', function () {
            this.urchin.exhaust();
            this.player1.reap(this.priestessLeilani);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.priestessLeilani);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.priestessLeilani);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not ready when there are no enemy creatures to exhaust', function () {
            this.player2.moveCard(this.troll, 'hand');
            this.player2.moveCard(this.krump, 'hand');
            this.urchin.exhaust();
            this.player1.reap(this.priestessLeilani);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
