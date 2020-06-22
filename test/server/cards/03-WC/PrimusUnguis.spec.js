describe('Primus Unguis', function () {
    describe("Primus Unguis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['primus-unguis', 'questor-jarta'],
                    hand: []
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should exalt after reap get +2 power per amber on itself', function () {
            this.player1.reap(this.primusUnguis);
            expect(this.primusUnguis.amber).toBe(1);
        });

        it('should exalt after reap get +2 power per amber on itself', function () {
            expect(this.primusUnguis.power).toBe(5);
            expect(this.questorJarta.power).toBe(3);
            expect(this.troll.power).toBe(8);

            this.primusUnguis.tokens.amber = 3;
            this.questorJarta.tokens.amber = 2;
            this.troll.tokens.amber = 1;

            this.player1.reap(this.primusUnguis);
            expect(this.primusUnguis.amber).toBe(4);

            expect(this.primusUnguis.power).toBe(13);
            expect(this.questorJarta.power).toBe(11);
            expect(this.troll.power).toBe(8);
        });
    });
});
