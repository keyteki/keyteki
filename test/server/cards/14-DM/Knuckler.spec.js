describe('Knuckler', function () {
    describe("Knuckler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['urchin', 'knuckler', 'silvertooth']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('grants +2 armor to neighbors while exhausted', function () {
            this.player1.reap(this.knuckler);
            expect(this.urchin.armor).toBe(2);
            expect(this.silvertooth.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant armor to neighbors while ready', function () {
            expect(this.urchin.armor).toBe(0);
            expect(this.silvertooth.armor).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant armor to non-neighbors', function () {
            this.player1.reap(this.knuckler);
            expect(this.troll.armor).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
