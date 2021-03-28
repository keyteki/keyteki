describe('Yxili Marauder', function () {
    describe("Yxili Marauder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['mindwarper', 'tunk'],
                    hand: ['yxili-marauder']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should capture 2 amber and get +1 for each amber', function () {
            this.player1.play(this.yxiliMarauder);
            this.player1.clickCard(this.yxiliMarauder);
            expect(this.yxiliMarauder.amber).toBe(2);
            expect(this.yxiliMarauder.power).toBe(4);
            expect(this.player2.amber).toBe(1);
        });

        it('should capture no amber when creatures are exhauste', function () {
            this.player1.reap(this.mindwarper);
            this.player1.reap(this.tunk);
            this.player1.play(this.yxiliMarauder);
            expect(this.yxiliMarauder.amber).toBe(0);
            expect(this.yxiliMarauder.power).toBe(2);
            expect(this.player2.amber).toBe(3);
        });
    });
});
