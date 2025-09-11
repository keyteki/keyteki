describe('Grat Tattuu', function () {
    describe("Grat Tattuu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['grat-tattuu'],
                    inPlay: ['old-boomy', 'troll', 'umbra']
                },
                player2: {
                    inPlay: ['shock-herder']
                }
            });
        });

        it('should give other friendly Brobnar creatures +2 power', function () {
            expect(this.oldBoomy.power).toBe(2);
            expect(this.troll.power).toBe(8);
            expect(this.umbra.power).toBe(2);
            expect(this.shockHerder.power).toBe(3);

            this.player1.playCreature(this.gratTattuu);

            expect(this.gratTattuu.power).toBe(5);
            expect(this.oldBoomy.power).toBe(4);
            expect(this.troll.power).toBe(10);
            expect(this.umbra.power).toBe(2);
            expect(this.shockHerder.power).toBe(3);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with house enhancements', function () {
            this.umbra.enhancements = ['brobnar'];
            this.player1.playCreature(this.gratTattuu);
            expect(this.gratTattuu.power).toBe(5);
            expect(this.oldBoomy.power).toBe(4);
            expect(this.troll.power).toBe(10);
            expect(this.umbra.power).toBe(4);
            expect(this.shockHerder.power).toBe(3);
        });
    });
});
