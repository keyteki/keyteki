describe('Chanel the Wise', function () {
    describe("Chanel the Wise's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['chanel-the-wise'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should give other friendly creatures +3 power', function () {
            this.player1.playCreature(this.chanelTheWise);
            expect(this.emberImp.power).toBe(5);
            expect(this.yurk.power).toBe(7);
            expect(this.chanelTheWise.power).toBe(2);
            expect(this.flaxia.power).toBe(4);
            expect(this.searine.power).toBe(4);
        });

        it('should give a friendly creature five +1 power counters when scrapped', function () {
            this.player1.scrap(this.chanelTheWise);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.power).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
