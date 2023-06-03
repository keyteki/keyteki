describe('Praetor Marius', function () {
    describe("Praetor Marius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['bubbles', 'paraguardian'],
                    inPlay: ['spartasaur', 'flaxia', 'praetor-marius', 'thero-centurion']
                },
                player2: {
                    amber: 10,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should capture zero if no exhausted creatures', function () {
            this.player1.reap(this.praetorMarius);
            expect(this.player2.amber).toBe(10);
        });

        it('should capture 2 if there are two exhausted creatures to left', function () {
            this.player1.reap(this.spartasaur);
            this.player1.playCreature(this.paraguardian, true);
            this.player1.reap(this.praetorMarius);
            expect(this.praetorMarius.amber).toBe(2);
            expect(this.player2.amber).toBe(8);
        });

        it('should capture 1 if there is 1 exhausted creatures to left, even when one to the right it exhausted', function () {
            this.player1.reap(this.theroCenturion);
            this.player1.playCreature(this.paraguardian, true);
            this.player1.reap(this.praetorMarius);
            expect(this.praetorMarius.amber).toBe(1);
            expect(this.player2.amber).toBe(9);
        });
    });
});
