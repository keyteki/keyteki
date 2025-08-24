describe('Unleash the Beast', function () {
    describe("Unleash the Beast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['unleash-the-beast'],
                    inPlay: ['bad-penny', 'krump']
                },
                player2: {
                    inPlay: ['troll', 'snufflegator']
                }
            });
        });

        it('should exhaust a friendly creature and deal damage equal to its power', function () {
            this.player1.play(this.unleashTheBeast);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.troll);
            expect(this.krump.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with creatures that have power counters', function () {
            this.krump.tokens.power = 2;
            this.player1.play(this.unleashTheBeast);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.krump.exhausted).toBe(true);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
