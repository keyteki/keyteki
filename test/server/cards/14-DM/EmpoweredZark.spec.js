describe('Empowered Zark', function () {
    describe("Empowered Zark's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['empowered-zark', 'iyxrenu-the-clever']
                },
                player2: {
                    amber: 5,
                    inPlay: ['urchin']
                }
            });
        });

        it('captures 2 amber on fight; if 3+ amber, may ready non-Agent Mars creatures', function () {
            this.empoweredZark.amber = 1;
            this.iyxrenuTheClever.exhausted = true;
            this.player1.fightWith(this.empoweredZark, this.urchin);
            // captured 2 -> total 3 amber on zark
            expect(this.empoweredZark.amber).toBe(3);
            this.player1.clickPrompt('Yes');
            expect(this.empoweredZark.amber).toBe(0);
            expect(this.iyxrenuTheClever.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing extra when Empowered Zark has fewer than 3 amber', function () {
            this.iyxrenuTheClever.exhausted = true;
            this.player1.fightWith(this.empoweredZark, this.urchin);
            // captured 2 amber -> only 2 on zark
            expect(this.empoweredZark.amber).toBe(2);
            // creature stays exhausted; no prompt
            expect(this.iyxrenuTheClever.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
