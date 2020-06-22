describe('Cornicen Octavia', function () {
    describe("Cornicen Octavia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['cornicen-octavia']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('should capture two amber as an action', function () {
            expect(this.player2.amber).toBe(4);
            expect(this.cornicenOctavia.amber).toBe(0);

            this.player1.useAction(this.cornicenOctavia);

            expect(this.player2.amber).toBe(2);
            expect(this.cornicenOctavia.amber).toBe(2);
        });
    });
});
