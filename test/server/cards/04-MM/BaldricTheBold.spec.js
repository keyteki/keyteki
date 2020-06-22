describe('Baldric The Bold', function () {
    describe("Baldric The Bold's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    inPlay: ['baldric-the-bold', 'tantadlin']
                },
                player2: {
                    inPlay: ['ember-imp', 'lamindra', 'spyyyder', 'troll']
                }
            });
        });
        it('should not gain amber if not fighting the most powerful creature', function () {
            this.player1.fightWith(this.baldricTheBold, this.emberImp);
            expect(this.player1.amber).toBe(1);
        });
        it('should gain amber if fighting the most powerful creature', function () {
            this.player1.fightWith(this.baldricTheBold, this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.baldricTheBold.location).toBe('discard');
        });
    });
});
