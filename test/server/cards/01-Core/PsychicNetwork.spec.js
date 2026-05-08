describe('Psychic Network', function () {
    describe("Psychic Network's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['psychic-network'],
                    inPlay: ['collector-worm', 'tangrant', 'tunk', 'yxili-marauder', 'zorg']
                },
                player2: {
                    amber: 4,
                    inPlay: ['molephin']
                }
            });
        });

        it('should steal 0 amber if all Mars creatures are exhausted', function () {
            this.collectorWorm.exhaust();
            this.tangrant.exhaust();
            this.tunk.exhaust();
            this.yxiliMarauder.exhaust();
            this.zorg.exhaust();
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 1 amber for each ready Mars creature', function () {
            this.tunk.exhaust();
            this.yxiliMarauder.exhaust();
            this.zorg.exhaust();
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal multiple amber, 1 at a time', function () {
            this.yxiliMarauder.ward();
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.yxiliMarauder.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal more amber than the opponent has', function () {
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
