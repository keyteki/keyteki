describe('Protective Playmate', function () {
    describe("Protective Playmate's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['protective-playmate'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.player1.chains = 36;
        });

        it('gains elusive when not haunted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            expect(this.protectivePlaymate.power).toBe(3);
            this.player2.fightWith(this.thingFromTheDeep, this.protectivePlaymate);
            expect(this.protectivePlaymate.location).toBe('play area');
            expect(this.protectivePlaymate.tokens.damage).toBe(undefined);
            expect(this.thingFromTheDeep.tokens.damage).toBe(undefined);
        });

        it('gains +6 power when haunted (but no elusive)', function () {
            expect(this.protectivePlaymate.power).toBe(3);
            this.player1.play(this.aStrongFeeling);
            expect(this.protectivePlaymate.power).toBe(9);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.thingFromTheDeep, this.protectivePlaymate);
            expect(this.protectivePlaymate.location).toBe('discard');
            expect(this.thingFromTheDeep.tokens.damage).toBe(9);
        });
    });
});
