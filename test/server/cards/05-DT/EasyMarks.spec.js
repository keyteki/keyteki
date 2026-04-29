describe('Easy Marks', function () {
    describe("Easy Marks's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    inPlay: ['ancient-bear', 'snufflegator', 'bumblebird'],
                    hand: ['easy-marks']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'faygin', 'shooler']
                }
            });

            this.murkens.damage = 1;
            this.shooler.damage = 1;
            this.ancientBear.damage = 2;
        });

        it('should exalt each damaged enemy creature', function () {
            this.player1.play(this.easyMarks);
            expect(this.ancientBear.amber).toBe(0);
            expect(this.snufflegator.amber).toBe(0);
            expect(this.bumblebird.amber).toBe(0);
            expect(this.murkens.amber).toBe(1);
            expect(this.faygin.amber).toBe(0);
            expect(this.shooler.amber).toBe(1);
        });
    });
});
