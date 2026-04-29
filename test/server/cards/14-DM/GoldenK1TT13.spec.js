describe('Golden K1-TT13', function () {
    describe("Golden K1-TT13's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['john-smyth', 'golden-k1-tt13', 'iyxrenu-the-clever']
                }
            });
        });

        it('grants reap-gain-1 to neighbors while exhausted', function () {
            this.goldenK1Tt13.exhausted = true;
            this.player1.reap(this.iyxrenuTheClever);
            // baseline reap = 1 amber, plus 1 from gained ability = 2
            expect(this.player1.amber).toBe(2);
        });

        it('does not grant ability while ready', function () {
            this.player1.reap(this.iyxrenuTheClever);
            expect(this.player1.amber).toBe(1);
        });
    });
});
