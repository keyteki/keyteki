describe('Yellow Amberdrake', function () {
    describe("Yellow Amberdrake's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['yellow-æmberdrake']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep']
                }
            });
        });

        it('should gain 4 when destroyed', function () {
            this.player1.fightWith(this.yellowÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge yellow key on destroyed if possible', function () {
            this.player1.amber = 3;
            this.player1.fightWith(this.yellowÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.keys.yellow).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge yellow key on opponent destroyed', function () {
            this.player1.amber = 3;
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.yellowÆmberdrake);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2); // steals the last one
            expect(this.player1.player.keys.yellow).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not forge any keys if yellow is already forged', function () {
            this.player1.player.keys = { yellow: true, red: false, blue: false };
            this.player1.amber = 3;
            this.player1.fightWith(this.yellowÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should win the game if other two keys are forged', function () {
            this.player1.player.keys = { yellow: false, red: true, blue: true };
            this.player1.amber = 3;
            this.player1.fightWith(this.yellowÆmberdrake, this.thingFromTheDeep);
            expect(this.player1).toHavePrompt('player1 has won the game!');
        });
    });
});
