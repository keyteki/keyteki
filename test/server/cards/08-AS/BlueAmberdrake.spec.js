describe('Blue Amberdrake', function () {
    describe("Blue Amberdrake's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['blue-æmberdrake']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep']
                }
            });
        });

        it('should gain 4 when destroyed', function () {
            this.player1.fightWith(this.blueÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge blue key on destroyed if possible', function () {
            this.player1.amber = 3;
            this.player1.fightWith(this.blueÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.keys.blue).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge blue key on opponent destroyed', function () {
            this.player1.amber = 3;
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.blueÆmberdrake);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2); // steals the last one
            expect(this.player1.player.keys.blue).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not forge any keys if blue is already forged', function () {
            this.player1.player.keys = { blue: true, red: false, yellow: false };
            this.player1.amber = 3;
            this.player1.fightWith(this.blueÆmberdrake, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should win the game if other two keys are forged', function () {
            this.player1.player.keys = { blue: false, red: true, yellow: true };
            this.player1.amber = 3;
            this.player1.fightWith(this.blueÆmberdrake, this.thingFromTheDeep);
            expect(this.player1).toHavePrompt('player1 has won the game!');
        });
    });
});
