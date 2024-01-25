describe('Tick-Tock', function () {
    describe("Tick-Tock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    hand: ['cpo-zytar', 'stealth-mode'],
                    inPlay: ['tick-tock', 'echofly'],
                    discard: ['a-strong-feeling', 'medic-ingram', 'tick-tock']
                },
                player2: {
                    amber: 5,
                    discard: ['thing-from-the-deep']
                }
            });
            this.tickTock2 = this.player1.discard[2];
        });

        it('adds a time counter at end of turn', function () {
            this.player1.endTurn();
            expect(this.tickTock.tokens.time).toBe(1);
            expect(this.tickTock.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('adds a time counter to each friendly clock at end of turn', function () {
            this.player1.moveCard(this.tickTock2, 'hand');
            this.player1.playCreature(this.tickTock2);
            this.player1.endTurn();
            this.player1.clickCard(this.tickTock);
            expect(this.tickTock.tokens.time).toBe(2);
            expect(this.tickTock2.tokens.time).toBe(2);
            expect(this.tickTock.location).toBe('play area');
            expect(this.tickTock2.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('destroys self with 3 time counters at end of turn and archives', function () {
            this.tickTock.tokens.time = 2;
            this.player1.endTurn();
            expect(this.tickTock.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.stealthMode);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.tickTock2);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.aStrongFeeling);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Done');
            expect(this.cpoZytar.location).toBe('archives');
            expect(this.aStrongFeeling.location).toBe('archives');
            expect(this.medicIngram.location).toBe('archives');
            expect(this.stealthMode.location).toBe('hand');
            this.player2.clickPrompt('unfathomable');
        });

        it('can archive fewer than 3', function () {
            this.tickTock.tokens.time = 2;
            this.player1.endTurn();
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.aStrongFeeling);
            this.player1.clickPrompt('Done');
            expect(this.cpoZytar.location).toBe('archives');
            expect(this.aStrongFeeling.location).toBe('archives');
            expect(this.medicIngram.location).toBe('discard');
            expect(this.stealthMode.location).toBe('hand');
            this.player2.clickPrompt('unfathomable');
        });
    });
});
