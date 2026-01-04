describe('Nice to Greet You', function () {
    describe("Nice to Greet You's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['nice-to-greet-you', 'myx-the-tallminded', 'mindwarper'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['blypyp']
                }
            });
        });

        it('should ready each mars creature', function () {
            this.troll.exhausted = true;
            this.blypyp.exhausted = true;
            this.player1.playCreature(this.myxTheTallminded);
            this.player1.playCreature(this.mindwarper);
            this.player1.play(this.niceToGreetYou);
            expect(this.troll.exhausted).toBe(true);
            expect(this.blypyp.exhausted).toBe(false);
            expect(this.myxTheTallminded.exhausted).toBe(false);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
