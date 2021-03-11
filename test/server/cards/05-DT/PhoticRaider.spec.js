describe('Photic Raider', function () {
    describe("Photic Raider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    hand: ['photic-raider']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.play(this.photicRaider);
        });

        it('should capture 2A', function () {
            expect(this.photicRaider.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('should not have +4 power when tide is neutral', function () {
            expect(this.photicRaider.power).toBe(2);
        });

        it('should not have +4 power when tide is low', function () {
            this.player1.lowerTide();
            expect(this.photicRaider.power).toBe(2);
        });

        it('should have +4 power when tide is high', function () {
            this.player1.raiseTide();
            expect(this.photicRaider.power).toBe(6);
        });
    });
});
