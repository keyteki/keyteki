describe('Yo Mama Mastery', function () {
    describe("Yo Mama Mastery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['yo-mama-mastery'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should grant taunt to attached creature', function () {
            this.player1.playUpgrade(this.yoMamaMastery, this.troll);
            expect(this.troll.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fully heal attached creature on play', function () {
            this.troll.damage = 6;
            this.player1.playUpgrade(this.yoMamaMastery, this.troll);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work on creature with no damage', function () {
            this.player1.playUpgrade(this.yoMamaMastery, this.troll);
            expect(this.troll.damage).toBe(0);
            expect(this.troll.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work on enemy creature', function () {
            this.bumpsy.damage = 4;
            this.player1.playUpgrade(this.yoMamaMastery, this.bumpsy);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.bumpsy.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
