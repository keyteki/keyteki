describe("Po's Pixies", function () {
    describe("Po's Pixies", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['skeleton-key', 'umbra'],
                    hand: ['camouflage']
                },
                player2: {
                    inPlay: ['po-s-pixies'],
                    amber: 1
                }
            });
        });

        it('should steal from common supply', function () {
            this.player1.fightWith(this.umbra, this.poSPixies);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should capture from common supply', function () {
            this.player1.useAction(this.skeletonKey);
            this.player1.clickCard(this.umbra);
            expect(this.player1.amber).toBe(0);
            expect(this.umbra.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not steal from common supply if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.fightWith(this.umbra, this.poSPixies);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should capture from common supply', function () {
            this.player2.amber = 0;
            this.player1.useAction(this.skeletonKey);
            this.player1.clickCard(this.umbra);
            expect(this.player1.amber).toBe(0);
            expect(this.umbra.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
        });
    });
});
