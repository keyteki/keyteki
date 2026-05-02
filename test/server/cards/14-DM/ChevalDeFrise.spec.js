describe('Cheval de Frise', function () {
    describe("Cheval de Frise's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['cheval-de-frise', 'silvertooth', 'flaxia']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('grants hazardous 2 to friendly Shadows creatures', function () {
            expect(this.silvertooth.getKeywordValue('hazardous')).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant hazardous to friendly non-Shadows creatures', function () {
            expect(this.flaxia.getKeywordValue('hazardous')).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant hazardous to enemy Shadows creatures', function () {
            expect(this.urchin.getKeywordValue('hazardous')).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant hazardous to enemy non-Shadows creatures', function () {
            expect(this.troll.getKeywordValue('hazardous')).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
