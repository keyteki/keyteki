describe('Darklamp', function () {
    describe("Darklamp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['darklamp'],
                    inPlay: ['charette', 'echofly']
                },
                player2: {
                    amber: 3,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.charette.amber = 3;
        });

        it('captures 1 on play', function () {
            this.player1.playCreature(this.darklamp);
            expect(this.darklamp.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes friendly creatures with amber on them elusive', function () {
            this.player1.playCreature(this.darklamp);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.charette);
            expect(this.thingFromTheDeep.tokens.damage).toBe(undefined);
            expect(this.charette.tokens.damage).toBe(undefined);
            expect(this.charette.location).toBe('play area');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not affect friendly creatures without amber on them', function () {
            this.player1.playCreature(this.darklamp);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.echofly);
            expect(this.thingFromTheDeep.tokens.damage).toBe(2);
            expect(this.echofly.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not affect enemy creatures', function () {
            this.thingFromTheDeep.amber = 1;
            this.player1.playCreature(this.darklamp);
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.thingFromTheDeep.tokens.damage).toBe(2);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
