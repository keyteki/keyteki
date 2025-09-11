describe('Synchronizer', function () {
    describe("Synchronizer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    inPlay: ['ancestral-timekeeper', 'tick-tock', 'chronometer', 'synchronizer']
                },
                player2: {
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.ancestralTimekeeper.tokens.time = 4;
            this.tickTock.tokens.time = 1;
            this.chronometer.tokens.time = 3;
        });

        it('grants friendly clocks a destroyed ability to move half of their time counters', function () {
            this.player1.fightWith(this.ancestralTimekeeper, this.thingFromTheDeep);
            expect(this.ancestralTimekeeper.location).toBe('discard');
            expect(this.synchronizer.tokens.time).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('rounds up the moved time tokens', function () {
            this.player1.fightWith(this.chronometer, this.thingFromTheDeep);
            expect(this.chronometer.location).toBe('discard');
            expect(this.synchronizer.tokens.time).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('moves time tokens to friendly clock as omni', function () {
            this.player1.fightWith(this.chronometer, this.thingFromTheDeep);
            expect(this.chronometer.location).toBe('discard');
            this.player1.useAction(this.synchronizer, true);
            expect(this.player1).toBeAbleToSelect(this.ancestralTimekeeper);
            expect(this.player1).toBeAbleToSelect(this.tickTock);
            expect(this.player1).not.toBeAbleToSelect(this.chronometer);
            this.player1.clickCard(this.tickTock);
            expect(this.tickTock.tokens.time).toBe(3);
            this.player1.endTurn();
            this.player1.clickCard(this.tickTock);
            this.player1.clickCard(this.chronometer);
            this.player1.clickPrompt('Done');
            expect(this.chronometer.location).toBe('archives');
            expect(this.tickTock.location).toBe('discard');
            this.player2.clickPrompt('unfathomable');
        });
    });
});
