describe('Llack Gaboon', function () {
    describe("Llack Gaboon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['llack-gaboon', 'hookmaster', 'lamindra'],
                    hand: ['sink-or-swim']
                },
                player2: {
                    inPlay: ['snufflegator', 'silvertooth']
                }
            });
        });

        it('should not gain +1p when it is exhausted', function () {
            expect(this.llackGaboon.power).toBe(3);
            this.player1.reap(this.llackGaboon);
            expect(this.llackGaboon.power).toBe(3);
        });

        it('should gain +1p for each other exhausted creature', function () {
            expect(this.llackGaboon.power).toBe(3);
            this.player1.play(this.sinkOrSwim);
            this.player1.clickPrompt('Exhaust');
            this.player1.clickCard(this.silvertooth);
            expect(this.llackGaboon.power).toBe(5);
        });

        it('should gain skirmish and hazardous:5 if 3 or more creatures are exhausted', function () {
            expect(this.llackGaboon.power).toBe(3);
            this.player1.play(this.sinkOrSwim);
            this.player1.clickPrompt('Exhaust');
            this.player1.clickCard(this.silvertooth);
            this.player1.reap(this.hookmaster);
            expect(this.llackGaboon.power).toBe(6);
            expect(this.llackGaboon.getKeywordValue('skirmish')).toBe(1);
            expect(this.llackGaboon.getKeywordValue('hazardous')).toBe(5);
        });
    });
});
