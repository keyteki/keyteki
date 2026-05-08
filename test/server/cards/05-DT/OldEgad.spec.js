describe('OldEgad', function () {
    describe("OldEgad's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['eyegor', 'old-egad', 'bad-penny', 'helper-bot']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        describe('when its destroyed', function () {
            beforeEach(function () {
                this.player1.fightWith(this.oldEgad, this.troll);
            });

            it('ward neighbors', function () {
                expect(this.eyegor.warded).toBe(true);
                expect(this.badPenny.warded).toBe(true);
                expect(this.helperBot.warded).toBe(false);
            });
        });
    });
});
