describe('Card334', function () {
    describe("Card334's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['card-334']
                },
                player2: {
                    inPlay: ['narp'],
                    discard: []
                }
            });
        });

        it('has no effect when the tide is neutral', function () {
            expect(this.card334.power).toBe(5);
            expect(this.card334.armor).toBe(1);
            expect(this.narp.power).toBe(8);
            expect(this.narp.armor).toBe(1);
        });

        it('raises friendly power and armor when the tide is high', function () {
            this.player1.raiseTide();
            expect(this.card334.power).toBe(6);
            expect(this.card334.armor).toBe(2);
            expect(this.narp.power).toBe(8);
            expect(this.narp.armor).toBe(1);
        });

        it('raises enemy power and armor when the tide is low', function () {
            this.player1.lowerTide();
            expect(this.card334.power).toBe(5);
            expect(this.card334.armor).toBe(1);
            expect(this.narp.power).toBe(9);
            expect(this.narp.armor).toBe(2);
        });
    });
});
