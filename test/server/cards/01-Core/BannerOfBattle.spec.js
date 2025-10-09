describe('Banner of Battle', function () {
    describe("Banner of Battle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['banner-of-battle', 'banner-of-battle'],
                    inPlay: ['troll', 'drummernaut']
                },
                player2: {
                    inPlay: ['hunting-witch', 'batdrone']
                }
            });
        });

        it('should give +1 power to all friendly creatures', function () {
            expect(this.troll.power).toBe(8);
            expect(this.drummernaut.power).toBe(6);
            this.player1.play(this.bannerOfBattle);
            expect(this.troll.power).toBe(9);
            expect(this.drummernaut.power).toBe(7);
        });

        it('should not affect enemy creatures', function () {
            expect(this.huntingWitch.power).toBe(2);
            expect(this.batdrone.power).toBe(2);
            this.player1.play(this.bannerOfBattle);
            expect(this.huntingWitch.power).toBe(2);
            expect(this.batdrone.power).toBe(2);
        });

        it('should stop affecting creatures when Banner is destroyed', function () {
            this.player1.play(this.bannerOfBattle);
            expect(this.troll.power).toBe(9);
            this.player1.moveCard(this.bannerOfBattle, 'discard');
            expect(this.troll.power).toBe(8);
        });

        it('should work with multiple Banner of Battles', function () {
            this.bannerOfBattle1 = this.player1.player.hand[0];
            this.bannerOfBattle2 = this.player1.player.hand[1];
            expect(this.troll.power).toBe(8);
            this.player1.play(this.bannerOfBattle1);
            expect(this.troll.power).toBe(9);
            this.player1.play(this.bannerOfBattle2);
            expect(this.troll.power).toBe(10);
        });
    });
});
