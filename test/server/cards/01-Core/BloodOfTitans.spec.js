describe('Blood of Titans', function () {
    describe("Blood of Titans's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['blood-of-titans', 'blood-of-titans'],
                    inPlay: ['troll', 'drummernaut']
                },
                player2: {
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should give +5 power to the attached creature', function () {
            expect(this.troll.power).toBe(8);
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            expect(this.troll.power).toBe(13);
        });

        it('should not affect other creatures', function () {
            expect(this.drummernaut.power).toBe(6);
            expect(this.huntingWitch.power).toBe(2);
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            expect(this.drummernaut.power).toBe(6);
            expect(this.huntingWitch.power).toBe(2);
        });

        it('should stop giving bonus when the upgrade is destroyed', function () {
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            expect(this.troll.power).toBe(13);
            this.player1.moveCard(this.bloodOfTitans, 'discard');
            expect(this.troll.power).toBe(8);
        });

        it('should work on creatures with plus power counters', function () {
            this.troll.tokens.power = 2;
            expect(this.troll.power).toBe(10);
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            expect(this.troll.power).toBe(15);
        });

        it('should stack with multiple power upgrades', function () {
            this.bloodOfTitans1 = this.player1.player.hand[0];
            this.bloodOfTitans2 = this.player1.player.hand[1];
            expect(this.troll.power).toBe(8);
            this.player1.playUpgrade(this.bloodOfTitans1, this.troll);
            expect(this.troll.power).toBe(13);
            this.player1.playUpgrade(this.bloodOfTitans2, this.troll);
            expect(this.troll.power).toBe(18);
        });
    });
});
