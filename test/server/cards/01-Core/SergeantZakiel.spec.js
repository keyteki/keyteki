describe('Sergeant Zakiel', function () {
    describe("Sergeant Zakiel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['sergeant-zakiel'],
                    inPlay: ['bulwark', 'sequis']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should be able to ready and fight with a neighbor', function () {
            this.sequis.exhausted = true;
            this.player1.play(this.sergeantZakiel);
            this.player1.clickPrompt('Left');
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.bumpsy);
            expect(this.sequis.exhausted).toBe(true);
            expect(this.bumpsy.tokens.damage).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow declining the ability', function () {
            this.player1.play(this.sergeantZakiel);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
