describe('Galactic Tariff', function () {
    describe('card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 3,
                    hand: ['galactic-tariff'],
                    inPlay: ['cpo-zytar']
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin']
                }
            });
        });

        it('should give the creature capture 1A after fight', function () {
            this.player1.playUpgrade(this.galacticTariff, this.cpoZytar);
            this.player1.fightWith(this.cpoZytar, this.urchin);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });

        it('should give the creature capture 1A after reap', function () {
            this.player1.playUpgrade(this.galacticTariff, this.cpoZytar);
            this.player1.reap(this.cpoZytar);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });
    });
});
