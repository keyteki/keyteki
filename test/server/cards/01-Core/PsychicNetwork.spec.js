describe('Psychic Network', function () {
    describe("Psychic Network's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['psychic-network'],
                    inPlay: ['zorg', 'collector-worm', 'yxili-marauder']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should steal 0 amber if all Mars creatures are exhausted', function () {
            this.zorg.exhausted = true;
            this.collectorWorm.exhausted = true;
            this.yxiliMarauder.exhausted = true;
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 1 amber for each ready Mars creature', function () {
            this.zorg.exhausted = true;
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal more amber than the opponent has', function () {
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
