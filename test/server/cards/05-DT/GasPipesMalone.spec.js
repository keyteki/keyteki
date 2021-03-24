describe('Gas-Pipes Malone', function () {
    describe("Gas-Pipes Malone's abilites", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['gas-pipes-malone']
                },
                player2: {
                    amber: 3,
                    inPlay: ['nexus', 'troll', 'mugwump', 'dust-pixie']
                }
            });
        });

        it('before fight, defender should capture 1 from their side', function () {
            this.player1.fightWith(this.gasPipesMalone, this.troll);
            expect(this.gasPipesMalone.location).toBe('discard');
            expect(this.troll.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
