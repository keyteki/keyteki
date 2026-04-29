describe('Pen Pal', function () {
    describe("Pen Pal's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['pen-pal', 'flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should exhaust a creature and gain each player amber', function () {
            this.player1.useAction(this.penPal);

            expect(this.player1).not.toBeAbleToSelect(this.penPal);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);
            expect(this.penPal.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.gub.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
        });

        it('should do nothing if enemy creatures were already exhausted', function () {
            this.gub.exhaust();
            this.krump.exhaust();
            this.player1.useAction(this.penPal);
            this.player1.clickCard(this.krump);
            expect(this.penPal.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.gub.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
