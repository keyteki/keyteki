describe('Chronometer', function () {
    describe("Chronometer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    inPlay: ['chronometer', 'echofly'],
                    discard: ['a-strong-feeling', 'medic-ingram', 'chronometer']
                },
                player2: {
                    amber: 5,
                    discard: ['thing-from-the-deep']
                }
            });
            this.chronometer2 = this.player1.discard[2];
        });

        it('adds a time counter at end of turn', function () {
            this.player1.endTurn();
            expect(this.chronometer.tokens.time).toBe(1);
            expect(this.chronometer.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('adds a time counter to each friendly clock at end of turn', function () {
            this.player1.moveCard(this.chronometer2, 'hand');
            this.player1.playCreature(this.chronometer2);
            this.player1.endTurn();
            this.player1.clickCard(this.chronometer);
            expect(this.chronometer.tokens.time).toBe(2);
            expect(this.chronometer2.tokens.time).toBe(2);
            expect(this.chronometer.location).toBe('play area');
            expect(this.chronometer2.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('destroys self with 6 time counters at end of turn and purges', function () {
            this.chronometer.tokens.time = 5;
            this.player1.endTurn();
            expect(this.chronometer.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.chronometer2);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            this.player1.clickCard(this.aStrongFeeling);
            expect(this.aStrongFeeling.location).toBe('purged');
            this.player2.clickPrompt('unfathomable');
        });
    });
});
