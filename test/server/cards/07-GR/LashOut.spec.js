describe('Lash Out', function () {
    describe("Lash Out's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['lash-out', 'press-gang'],
                    inPlay: ['troll'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['mollymawk', 'flaxia', 'dust-pixie']
                }
            });
        });

        it('does only 3 damage to a creature when not haunted', function () {
            this.player1.play(this.lashOut);
            expect(this.player1).toBeAbleToSelect(this.mollymawk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.mollymawk.tokens.damage).toBe(undefined);
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('also does 3 splash when haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.play(this.lashOut);
            this.player1.clickCard(this.flaxia);
            expect(this.mollymawk.tokens.damage).toBe(3);
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
