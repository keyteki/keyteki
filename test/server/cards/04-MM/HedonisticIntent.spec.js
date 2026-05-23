describe('Hedonistic Intent', function () {
    describe("Hedonistic Intent's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['hedonistic-intent'],
                    inPlay: ['troll', 'urchin', 'lamindra']
                },
                player2: {
                    inPlay: ['nexus', 'umbra', 'dodger']
                }
            });
        });

        it('exalts each flank creature', function () {
            this.player1.play(this.hedonisticIntent);
            expect(this.troll.amber).toBe(1);
            expect(this.urchin.amber).toBe(0);
            expect(this.lamindra.amber).toBe(1);
            expect(this.nexus.amber).toBe(1);
            expect(this.umbra.amber).toBe(0);
            expect(this.dodger.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
