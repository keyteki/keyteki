describe('Nomadic Insight', function () {
    describe("Nomadic Insight's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['nomadic-insight'],
                    inPlay: ['lamindra', 'troll', 'umbra']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should cause each friendly flank creature to capture 1', function () {
            this.player1.play(this.nomadicInsight);
            expect(this.player2.amber).toBe(3);
            expect(this.lamindra.amber).toBe(1);
            expect(this.umbra.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow choosing a friendly flank creature if only 1 amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.nomadicInsight);
            this.player1.clickCard(this.umbra);
            expect(this.player2.amber).toBe(0);
            expect(this.lamindra.amber).toBe(0);
            expect(this.umbra.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
